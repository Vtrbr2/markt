const express = require('express');
const router  = express.Router();
const { EDUSP_API } = require('../config');

/**
 * GET /leiasp/handoff?auth_token=<edusp_jwt>
 *
 * Gera o token externo seducsp e redireciona para o LeiaFácil / Elefante Letrado.
 * O frontend chama:
 *   window.open(`/leiasp/handoff?auth_token=${eduspToken}`)
 */
router.get('/leiasp/handoff', async (req, res) => {
  const { auth_token } = req.query;
  if (!auth_token) return res.status(400).json({ error: 'auth_token ausente' });

  try {
    const response = await fetch(
      `${EDUSP_API}/mas/external-auth/seducsp_token/generate`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'x-api-key': auth_token,
          'x-api-realm': 'edusp',
          'x-api-platform': 'webclient',
        },
      }
    );

    if (!response.ok) {
      const body = await response.text();
      return res.status(response.status).json({ error: body });
    }

    const data = await response.json();
    const externalToken = data.token || data.access_token || data.seducsp_token;

    if (!externalToken) {
      return res.status(502).json({ error: 'Token externo não retornado', data });
    }

    // Redireciona para o LeiaFácil com o token SSO
    const targetUrl = `https://www.elefanteletrado.com.br/login-automatico?token=${encodeURIComponent(externalToken)}`;
    res.redirect(targetUrl);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
