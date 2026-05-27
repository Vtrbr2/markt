const express = require('express');
const router = express.Router();
const { EDUSP_API, SED_API, OCP_KEY, SED_STATIC_HEADERS } = require('../config');

async function proxyFetch(url, options) {
  const response = await fetch(url, options);
  const body = await response.text();
  return { status: response.status, body };
}

function sedHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ocp-apim-subscription-key': OCP_KEY,
    ...SED_STATIC_HEADERS,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// POST /sed/login
router.post('/sed/login', async (req, res) => {
  try {
    const { status, body } = await proxyFetch(
      `${SED_API}/credenciais/api/LoginCompletoToken`,
      {
        method: 'POST',
        headers: sedHeaders(),
        body: JSON.stringify(req.body)
      }
    );

    res.status(status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// POST /sed/credenciais/api/ValidarToken
router.post('/sed/credenciais/api/ValidarToken', async (req, res) => {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

  try {
    const { status, body } = await proxyFetch(
      `${SED_API}/credenciais/api/ValidarToken`,
      {
        method: 'POST',
        headers: sedHeaders(token)
      }
    );

    res.status(status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// POST /registration/edusp/token
// Body: { token: '<token_sed>' }
router.post('/registration/edusp/token', async (req, res) => {
  const { token } = req.body || {};

  if (!token) {
    return res.status(400).json({
      error: 'token ausente',
      detail: 'Envie o token SED no body: { "token": "..." }'
    });
  }

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
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Origin': 'https://cmsp.ip.tv',
          'Referer': 'https://cmsp.ip.tv/'
        },
        body: JSON.stringify({ token })
      }
    );

    res.status(status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

module.exports = router;
