const express = require('express');
const router  = express.Router();
const { EDUSP_API, SED_API, OCP_KEY, SED_STATIC_HEADERS } = require('../config');

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function proxyFetch(url, options) {
  const res = await fetch(url, options);
  const body = await res.text();
  return { status: res.status, body };
}

function sedHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ocp-apim-subscription-key': OCP_KEY,
    ...SED_STATIC_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── POST /sed/login ──────────────────────────────────────────────────────────
// Body: { user, senha }
// Retorna o token SED + dados do usuário
router.post('/sed/login', async (req, res) => {
  try {
    const { status, body } = await proxyFetch(
      `${SED_API}/credenciais/api/LoginCompletoToken`,
      {
        method: 'POST',
        headers: sedHeaders(),
        body: JSON.stringify(req.body),
      }
    );
    res.status(status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ─── POST /sed/credenciais/api/ValidarToken ───────────────────────────────────
// Usado para validar se o token SED ainda é válido (sessão restaurada)
router.post('/sed/credenciais/api/ValidarToken', async (req, res) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    const { status, body } = await proxyFetch(
      `${SED_API}/credenciais/api/ValidarToken`,
      {
        method: 'POST',
        headers: sedHeaders(token),
      }
    );
    res.status(status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ─── POST /registration/edusp/token ──────────────────────────────────────────
// Troca token SED por token EDUSP
// Body: { token: "<sed_jwt>" }
router.post('/registration/edusp/token', async (req, res) => {
  try {
    const { status, body } = await proxyFetch(
      `${EDUSP_API}/registration/edusp/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-api-realm': 'edusp',
          'x-api-platform': 'webclient',
        },
        body: JSON.stringify(req.body),
      }
    );
    res.status(status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
