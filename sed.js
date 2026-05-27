const express = require('express');
const router  = express.Router();
const { SED_API, OCP_KEY, SED_STATIC_HEADERS } = require('../config');

/**
 * Proxy genérico SED.
 * - Remove o prefixo /sed do path antes de repassar.
 * - Injeta ocp-apim-subscription-key e headers estáticos.
 * - Repassa o Authorization: Bearer do cliente (token SED).
 */
async function proxySed(req, res) {
  // /sed/apihubintegracoes/... → /apihubintegracoes/...
  const upstreamPath = req.originalUrl.replace(/^\/sed/, '');
  const upstream     = `${SED_API}${upstreamPath}`;
  const sedToken     = (req.headers.authorization || '').replace('Bearer ', '');
  const hasBody      = ['POST', 'PUT', 'PATCH'].includes(req.method);

  try {
    const response = await fetch(upstream, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ocp-apim-subscription-key': OCP_KEY,
        ...SED_STATIC_HEADERS,
        ...(sedToken ? { Authorization: `Bearer ${sedToken}` } : {}),
      },
      ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
    });

    const body = await response.text();
    res.status(response.status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

// ─── Tudo que chegou em /sed/* e não foi capturado por auth.js ───────────────
// apihubintegracoes, cmspwebservice, muralavisosapi, apiboletim,
// apisalaconquistas, alunoapi, api/Aluno, etc.
router.all('*', proxySed);

module.exports = router;
