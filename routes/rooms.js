const express = require('express');
const router = express.Router();
const requireToken = require('../middleware/requireToken');
const { EDUSP_API } = require('../config');

// Todas as rotas EDUSP abaixo precisam de token.
router.use(requireToken);

async function proxyEdusp(req, res) {
  const upstream = `${EDUSP_API}${req.originalUrl}`;
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method);

  try {
    const response = await fetch(upstream, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': req.eduspToken,
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Origin': 'https://cmsp.ip.tv',
        'Referer': 'https://cmsp.ip.tv/',
        ...(req.headers['if-none-match'] ? { 'if-none-match': req.headers['if-none-match'] } : {})
      },
      ...(hasBody ? { body: JSON.stringify(req.body) } : {})
    });

    const body = await response.text();
    res.status(response.status).type('application/json').send(body);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
}

router.all('/room/*', proxyEdusp);
router.all('/tms/*', proxyEdusp);
router.all('/survey/*', proxyEdusp);
router.all('/achievement/*', proxyEdusp);
router.all('/mas/*', proxyEdusp);

module.exports = router;
