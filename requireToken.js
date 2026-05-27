/**
 * Extrai o token EDUSP do header x-api-key.
 * Também aceita Authorization: Bearer como fallback, mas o padrão certo é x-api-key.
 */
function requireToken(req, res, next) {
  const apiKeyToken = req.headers['x-api-key'];
  const bearerToken = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const token = apiKeyToken || bearerToken;

  if (!token) {
    return res.status(401).json({
      error: 'x-api-key ausente',
      detail: 'Envie o auth_token EDUSP no header x-api-key.'
    });
  }

  req.eduspToken = token;
  next();
}

module.exports = requireToken;
