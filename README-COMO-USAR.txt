COMO INSTALAR

1. Copie esses arquivos para a raiz do seu projeto server.
2. A estrutura precisa ficar assim:

server/
  index.js
  config.js
  package.json
  routes/
    auth.js
    rooms.js
    sed.js
    leiasp.js
  middleware/
    requireToken.js

3. Rode:
   npm install
   npm start

TESTE RÁPIDO

Health check:
  https://SEU_BACKEND/ping

LeiaSP:
  https://SEU_BACKEND/leiasp/handoff?auth_token=SEU_AUTH_TOKEN_EDUSP

Também funciona com:
  https://SEU_BACKEND/leiasp/handoff?token=SEU_AUTH_TOKEN_EDUSP

IMPORTANTE

Rotas como /room/user e /tms/task/todo precisam do header:
  x-api-key: SEU_AUTH_TOKEN_EDUSP

Abrir essas rotas direto no navegador sem header vai continuar dando x-api-key ausente. Isso é normal.
