const express = require('express');
const router = express.Router();
const { EDUSP_API, LEIASP_URL } = require('../config');

/**
 * GET /leiasp/handoff?auth_token=<edusp_jwt>
 * Também aceita:
 *   /leiasp/handoff?token=<edusp_jwt>
 *   header x-api-key: <edusp_jwt>
 *
 * Gera o token externo LeiaSP e redireciona para o frontend do LeiaFácil.
 */
router.get('/leiasp/handoff', async (req, res) => {
  const authToken = req.query.auth_token || req.query.token || req.headers['x-api-key'];

  if (!authToken) {
    return res.status(400).json({
      error: 'auth_token ausente',
      detail: 'Use /leiasp/handoff?auth_token=SEU_AUTH_TOKEN ou envie x-api-key no header.'
    });
  }

  try {
    const response = await fetch(
      `${EDUSP_API}/mas/external-auth/seducsp_token/generate?card_label=LeiaSP%2B`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': authToken,
          'x-api-realm': 'edusp',
          'x-api-platform': 'webclient',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Origin': 'https://cmsp.ip.tv',
          'Referer': 'https://cmsp.ip.tv/'
        }
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Falha ao gerar token externo LeiaSP',
        detail: text
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: 'Resposta inválida da EDUSP',
        detail: text.slice(0, 300)
      });
    }

    const externalToken = data.token || data.access_token || data.seducsp_token;

    if (!externalToken) {
      return res.status(502).json({
        error: 'Token externo não retornado',
        data
      });
    }

    return res.redirect(`${LEIASP_URL}?token=${encodeURIComponent(externalToken)}`);
  } catch (err) {
    return res.status(502).json({ error: err.message });
  }
});

module.exports = router;
