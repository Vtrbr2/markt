/**
 * Extrai o token EDUSP do header x-api-key.
 * Rotas que precisam de auth EDUSP usam este middleware.
 */
function requireToken(req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token) {
    return res.status(401).json({ error: 'x-api-key ausente' });
  }
  req.eduspToken = token;
  next();
}

module.exports = requireToken;
