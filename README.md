
#1.1 Estrutura geral de pastas
```
marketplace/
├── apps/
│   ├── backend/          # NestJS
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env
│   └── frontend/         # Next.js
│       ├── src/
│       │   └── app/
│       │       ├── layout.tsx
│       │       └── page.tsx
│       ├── package.json
│       ├── tailwind.config.ts
│       └── tsconfig.json
├── .gitignore
└── README.md
```
#1.4 Instalação
No terminal, na raiz do projeto:

```
# Backend
cd apps/backend
npm install

# Frontend
cd ../frontend
npm install
```

#ETAPA 2 – Banco de Dados: Entidades, Migrações e Seeds
Agora vamos criar todas as entidades do TypeORM, a configuração da conexão e os scripts de migração.

2.1 Criar a pasta e o arquivo de data source

#

obs:
```
      Arquivo: apps/backend/src/database/data-source.ts
Atenção: Para que dotenv funcione aqui, adicione ao backend: npm install dotenv e no package.json já incluí.
obs:
```


2.2 Entidades
Vamos criar as entidades dentro de cada módulo, conforme planejamento. Por enquanto, criaremos apenas as entidades, sem os módulos completos (que virão nas próximas etapas). Os arquivos ficarão em src/modules/users/entities/user.entity.ts, etc.
