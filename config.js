module.exports = {
  PORT: process.env.PORT || 3000,

  // APIs upstream
  EDUSP_API: 'https://edusp-api.ip.tv',
  SED_API:   'https://sedintegracoes.educacao.sp.gov.br/saladofuturobffapi',

  // Chave fixa do gateway do SED (ocp-apim-subscription-key)
  OCP_KEY: process.env.OCP_KEY || 'd701a2043aa24d7ebb37e9adf60d043b',

  // Headers que o SED exige em toda requisição
  SED_STATIC_HEADERS: {
    'x-product-name': 'SalaDoFuturo',
    'Referer': 'https://saladofuturo.educacao.sp.gov.br/',
  },

  // CORS — coloque a origem do seu frontend aqui
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '*').split(','),
};
