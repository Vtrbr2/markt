
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

2.3 Configurar o TypeORM no AppModule
Precisamos importar as entidades no módulo principal para o autoLoadEntities encontrá-las. Basta ter as classes decoradas com @Entity() e importar os módulos que as contêm no futuro. Por enquanto, o autoLoadEntities: true já as localiza se os módulos forem carregados. Vamos manter assim.

2.4 Gerar e rodar a primeira migração
Com as entidades definidas, abra o terminal em apps/backend e execute:
```
bash
npm run migration:generate --name=InitialCreate
```
Isso criará uma migração em src/database/migrations. Em seguida, rode:
```
bash
npm run migration:run
As tabelas serão criadas no banco de dados PostgreSQL.
```
2.5 Seeds básicos

Em apps/backend/src/database/seeds/run-seeds.ts

Rode:
```
npm run seed
```

RESUMO

# Marketplace - Projeto Completo

## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)

## Próximas Etapas
⏳ Etapa 4 - Produtos e Categorias
⏳ Etapa 5 - Upload de Imagens
⏳ Etapa 6 - Carrinho e Pedidos
⏳ Etapa 7 - Pagamentos
⏳ Etapa 8 - Frontend Público
⏳ Etapa 9 - Painel do Vendedor
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy

**🚀 ETAPA 4 – Backend de Produtos e Categorias **

Agora vamos criar os módulos categories e products completos no NestJS:
CRUD de categorias (admin cria, público lista)
CRUD de produtos (vendedor cria/edita seus próprios, admin gerencia todos)
Listagem pública com paginação, busca textual e filtros
Variações de produto (cor, tamanho, etc.)
Status do produto (ativo, pausado, vendido, em análise)
Validações de permissão com Guards

Estrutura de pastas desta etapa

```
apps/backend/src/modules/
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── dto/
│   │   ├── create-category.dto.ts
│   │   └── update-category.dto.ts
│   └── entities/
│       └── category.entity.ts (já existe)
└── products/
    ├── products.module.ts
    ├── products.controller.ts
    ├── products.service.ts
    ├── dto/
    │   ├── create-product.dto.ts
    │   ├── update-product.dto.ts
    │   └── product-query.dto.ts
    └── entities/
        ├── product.entity.ts (já existe)
        └── product-image.entity.ts (já existe)
```

4.1 – Módulo de Categorias
