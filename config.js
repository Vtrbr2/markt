module.exports = {
  PORT: process.env.PORT || 3000,

  // APIs upstream
  EDUSP_API: 'https://edusp-api.ip.tv',
  SED_API: 'https://sedintegracoes.educacao.sp.gov.br/saladofuturobffapi',

  // Pode deixar no Railway como variável OCP_KEY. Se não tiver, usa essa padrão.
  OCP_KEY: process.env.OCP_KEY || 'd701a2043aa24d7ebb37e9adf60d043b',

  // Para onde o handoff do LeiaSP vai redirecionar depois de gerar o token externo.
  // No Railway, se quiser trocar, crie a variável LEIASP_URL.
  LEIASP_URL: process.env.LEIASP_URL || 'https://cryptitys-qu5t.vercel.app/LeiaSP',

  SED_STATIC_HEADERS: {
    'x-product-name': 'SalaDoFuturo',
    'Referer': 'https://saladofuturo.educacao.sp.gov.br/'
  },

  // Pode usar * ou colocar seu domínio do Vercel/Railway separado por vírgula
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '*').split(',')
};
