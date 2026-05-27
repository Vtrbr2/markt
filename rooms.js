const express = require('express');
const router  = express.Router();
const requireToken = require('../middleware/requireToken');
const { EDUSP_API } = require('../config');

// Todas as rotas EDUSP precisam do x-api-key
router.use(requireToken);

/**
 * Proxy genérico: repassa a rota inteira para EDUSP,
 * preservando query string e body, injetando o token.
 */
async function proxyEdusp(req, res) {
  const upstream = `${EDUSP_API}${req.originalUrl}`;
  const hasBody  = ['POST', 'PUT', 'PATCH'].includes(req.method);

  try {
    const response = await fetch(upstream, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': req.eduspToken,
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
        'Referer': 'https://saladofuturo.educacao.sp.gov.br/',
        // repassa cache headers se o cliente enviar
        ...(req.headers['if-none-match'] ? { 'if-none-match': req.headers['if-none-match'] } : {}),
      },
      ...(hasBody ? { body: JSON.stringify(req.body) } : {}),
    });

    const body = await response.text();
    res.status(response.status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

// ─── Rotas EDUSP ──────────────────────────────────────────────────────────────
// GET  /room/user
// GET  /room/category
router.get('/room/*', proxyEdusp);

// GET  /tms/task/todo
// GET  /tms/task/todo/count
// GET  /tms/task/:taskId/apply
// GET  /tms/task/targets/categories
// GET  /tms/answer
// GET  /tms/adaptive-assessment/todo
router.get('/tms/*', proxyEdusp);

// GET  /survey/todo/count
router.get('/survey/*', proxyEdusp);

// GET  /achievement/user/achievement
router.get('/achievement/*', proxyEdusp);

// GET  /mas/realm/edusp/config
// GET  /mas/external-auth/seducsp_token/generate  (LeiaFácil handoff gerador)
router.get('/mas/*', proxyEdusp);

module.exports = router;
