
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

```apps/backend/src/modules/categories/dto/update-category.dto.ts ```
Instale o pacote @nestjs/mapped-types se ainda não tiver:
npm install @nestjs/mapped-types

4.2 – Módulo de Produtos
4.3 atualização do AppMOdule

## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)

## Próximas Etapas
⏳ Etapa 5 - Upload de Imagens
⏳ Etapa 6 - Carrinho e Pedidos
⏳ Etapa 7 - Pagamentos
⏳ Etapa 8 - Frontend Público
⏳ Etapa 9 - Painel do Vendedor
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy

ETAPA 5 – Upload de Imagens (com abstração para Cloudinary, Firebase, Supabase, S3...)

```
apps/backend/src/modules/upload/
├── upload.module.ts
├── upload.controller.ts
├── upload.service.ts
├── providers/
│   ├── storage-provider.interface.ts    ← Interface (contrato)
│   ├── local-storage.provider.ts        ← Implementação local
│   └── (futuro) cloudinary.provider.ts
│   ├── (futuro) supabase.provider.ts
│   ├── (futuro) firebase.provider.ts
│   ├── (futuro) s3.provider.ts
├── dto/
│   └── upload-response.dto.ts
└── multer.config.ts
```

apps/backend/uploads/   ← pasta local (criada automaticamente, adicionada ao .gitignore)

5.1 – Interface (contrato) do Storage Provider
Arquivo: apps/backend/src/modules/upload/providers/storage-provider.interface.ts

5.2 – Implementação Local (disco)
Arquivo: apps/backend/src/modules/upload/providers/local-storage.provider.ts

5.3 – Configuração do Multer
Arquivo: apps/backend/src/modules/upload/multer.config.ts

5.4 – Upload Service
Arquivo: apps/backend/src/modules/upload/upload.service.ts

5.5 – Upload Controller
Arquivo: apps/backend/src/modules/upload/upload.controller.ts

5.6 – Módulo de Upload (com injeção dinâmica do provider)
Arquivo: apps/backend/src/modules/upload/upload.module.ts

5.7 – Servir arquivos estáticos (local)

5.8 – Atualizar .env e .gitignore

5.9 – Atualizar AppModule

5.10 – Como trocar para Cloudinary (exemplo futuro)

Basta criar este arquivo e trocar no módulo:

apps/backend/src/modules/upload/providers/cloudinary.provider.ts

```
import { Injectable } from '@nestjs/common';
import { StorageProvider, UploadedFile } from './storage-provider.interface';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryProvider implements StorageProvider {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async save(file: Express.Multer.File, folder: string): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            key: result.public_id,
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          });
        },
      ).end(file.buffer);
    });
  }

  async delete(key: string): Promise<void> {
    await cloudinary.uploader.destroy(key);
  }

  getUrl(key: string): string {
    return cloudinary.url(key, { secure: true });
  }
}
```
E no UploadModule, trocar:
```
useClass: CloudinaryProvider
```
## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)

## Próximas Etapas
⏳ Etapa 6 - Carrinho e Pedidos
⏳ Etapa 7 - Pagamentos
⏳ Etapa 8 - Frontend Público
⏳ Etapa 9 - Painel do Vendedor
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy

Estrutura da Etapa 6

 o comprador adiciona produtos ao carrinho, revisa e finaliza a compra, gerando um pedido com status, controle de estoque e snapshot dos produtos.
 ```
apps/backend/src/modules/
├── cart/
│   ├── cart.module.ts
│   ├── cart.controller.ts
│   ├── cart.service.ts
│   ├── dto/
│   │   ├── add-cart-item.dto.ts
│   │   └── update-cart-item.dto.ts
│   └── entities/
│       ├── cart.entity.ts       (já existe)
│       └── cart-item.entity.ts  (já existe)
└── orders/
    ├── orders.module.ts
    ├── orders.controller.ts
    ├── orders.service.ts
    ├── dto/
    │   ├── create-order.dto.ts
    │   └── update-order-status.dto.ts
    └── entities/
        ├── order.entity.ts      (já existe)
        └── order-item.entity.ts (já existe)
```

6.1 – Módulo de Carrinho
apps/backend/src/modules/cart/dto/add-cart-item.dto.ts

apps/backend/src/modules/cart/dto/update-cart-item.dto.ts

apps/backend/src/modules/cart/cart.service.ts

apps/backend/src/modules/cart/cart.controller.ts

apps/backend/src/modules/cart/cart.module.ts

6.2 – Módulo de Pedidos
apps/backend/src/modules/orders/dto/create-order.dto.ts

apps/backend/src/modules/orders/dto/update-order-status.dto.ts

apps/backend/src/modules/orders/orders.service.ts

apps/backend/src/modules/orders/orders.controller.ts

apps/backend/src/modules/orders/orders.module.ts

6.3 – Atualizar AppModule

etc...

## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)
✅ Etapa 6 - Carrinho e Pedidos (Adicionar, Finalizar, Status, Estoque)

## Próximas Etapas
⏳ Etapa 7 - Pagamentos
⏳ Etapa 8 - Frontend Público
⏳ Etapa 9 - Painel do Vendedor
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy


ETAPA 7 – Pagamentos (estrutura desacoplada para múltiplos gateways)
Estrutura da Etapa 7

```
apps/backend/src/modules/payments/
├── payments.module.ts
├── payments.controller.ts
├── payments.service.ts
├── gateways/
│   ├── payment-gateway.interface.ts     ← Interface (contrato)
│   ├── mercado-pago.gateway.ts          ← Implementação Mercado Pago
│   └── fake.gateway.ts                  ← Simulação para testes
├── dto/
│   ├── checkout.dto.ts
│   └── webhook.dto.ts
└── entities/
    └── payment.entity.ts                (já existe)
```
## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)
✅ Etapa 6 - Carrinho e Pedidos (Adicionar, Finalizar, Status, Estoque)
✅ Etapa 7 - Pagamentos (Interface desacoplada, Mercado Pago, Fake Gateway)

## Próximas Etapas
⏳ Etapa 8 - Frontend Público
⏳ Etapa 9 - Painel do Vendedor
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy

ETAPA 8 – Frontend Público

apps/frontend/src/
├── app/
│   ├── layout.tsx                    (atualizar - adicionar Navbar/Footer)
│   ├── page.tsx                      (atualizar - Home com destaques)
│   ├── globals.css                   (já existe, manter)
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── cadastro/
│   │       └── page.tsx
│   ├── produto/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── busca/
│   │   └── page.tsx
│   ├── carrinho/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   └── (account)/
│       ├── meus-pedidos/
│       │   └── page.tsx
│       └── perfil/
│           └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── StarRating.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── cart/
│   │   └── CartItem.tsx
│   └── order/
│       └── OrderCard.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── services/
│   └── api.ts
├── hooks/
│   ├── useAuth.ts
│   └── useCart.ts
├── types/
│   └── index.ts
└── lib/
    └── utils.ts
   

   # 8.1 – Tipagens TypeScript

## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)
✅ Etapa 6 - Carrinho e Pedidos (Adicionar, Finalizar, Status, Estoque)
✅ Etapa 7 - Pagamentos (Interface desacoplada, Mercado Pago, Fake Gateway)
✅ Etapa 8 - Frontend Público (Home, Busca, Produto, Carrinho, Checkout, Pedidos, Perfil)

## Próximas Etapas
⏳ Etapa 9 - Painel do Vendedor
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy

9
ETAPA 9 – Painel do Vendedor

```
apps/frontend/src/
├── app/
│   └── (seller)/                          ← Route group para vendedor
│       ├── layout.tsx                     ← Layout do painel (sidebar + verificação de role)
│       ├── painel/
│       │   └── page.tsx                   ← Dashboard com métricas
│       ├── produtos/
│       │   ├── page.tsx                   ← Lista de produtos do vendedor
│       │   ├── novo/
│       │   │   └── page.tsx               ← Cadastro de produto com upload
│       │   └── [id]/
│       │       └── editar/
│       │           └── page.tsx           ← Edição de produto
│       ├── vendas/
│       │   ├── page.tsx                   ← Lista de vendas (pedidos)
│       │   └── [id]/
│       │       └── page.tsx               ← Detalhes de uma venda
│       └── loja/
│           └── page.tsx                   ← Editar dados da loja
├── components/
│   └── seller/
│       ├── Sidebar.tsx
│       ├── ProductForm.tsx                ← Formulário reutilizável (criar/editar)
│       └── ImageUploader.tsx              ← Componente de upload com preview
└── services/
    └── api.ts                             (atualizar - adicionar sellersAPI)
```

9.1 – Atualizar API Service (adicionar sellersAPI)
etc...

## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)
✅ Etapa 6 - Carrinho e Pedidos (Adicionar, Finalizar, Status, Estoque)
✅ Etapa 7 - Pagamentos (Interface desacoplada, Mercado Pago, Fake Gateway)
✅ Etapa 8 - Frontend Público (Home, Busca, Produto, Carrinho, Checkout, Pedidos, Perfil)
✅ Etapa 9 - Painel do Vendedor (Dashboard, Produtos c/ Upload, Vendas, Loja)

## Próximas Etapas
⏳ Etapa 10 - Painel Administrativo
⏳ Etapa 11 - Segurança, Validações e Deploy


ETAPA 10 – Painel Administrativo

Estrutura da Etapa 10

```
apps/backend/src/modules/admin/
├── admin.module.ts
├── admin.controller.ts
├── admin.service.ts
└── entities/
    └── admin-log.entity.ts   (já existe)
```

Frontend:

```
apps/frontend/src/app/(admin)/
├── layout.tsx                 ← Layout com sidebar de admin
├── admin/
│   └── page.tsx               ← Dashboard geral
├── admin/usuarios/
│   └── page.tsx               ← Gerenciar usuários
├── admin/produtos/
│   └── page.tsx               ← Gerenciar produtos (aprovar/reprovar)
└── admin/pedidos/
    └── page.tsx               ← Visualizar todos pedidos
```

10.1 – Backend: Admin Module
etc...

## Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)
✅ Etapa 6 - Carrinho e Pedidos (Adicionar, Finalizar, Status, Estoque)
✅ Etapa 7 - Pagamentos (Interface desacoplada, Mercado Pago, Fake Gateway)
✅ Etapa 8 - Frontend Público (Home, Busca, Produto, Carrinho, Checkout, Pedidos, Perfil)
✅ Etapa 9 - Painel do Vendedor (Dashboard, Produtos c/ Upload, Vendas, Loja)
✅ Etapa 10 - Painel Administrativo (Dashboard, Gerenciar Usuários/Produtos/Pedidos, Logs)

## Próxima Etapa
⏳ Etapa 11 - Segurança, Validações e Deploy

ETAPA 11 – Segurança, Validações e Deploy

```
apps/backend/src/
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts
│   └── pipes/
│       └── (validation pipe já existe - revisar)
├── main.ts                         (atualizar - helmet, rate limit, cors)
├── app.module.ts                   (atualizar - throttler module)
├── .env.example                    (criar)
└── Dockerfile                      (criar)

apps/frontend/
├── .env.local                      (já existe)
├── .env.production                 (criar)
├── middleware.ts                   (criar - proteção de rotas)
├── Dockerfile                      (criar)
└── next.config.js                  (atualizar - headers de segurança)

raiz/
├── docker-compose.yml              (criar)
├── .gitignore                      (atualizar)
└── README.md                       (atualizar - final)
```

11.1 – Backend: Segurança Global
etc...

Instale as dependências necessárias:
```
cd apps/backend
npm install helmet express-rate-limit
npm install -D @types/express-rate-limit
```

11.5 – Frontend: Middleware de proteção de rotas
Arquivo: apps/frontend/src/middleware.ts

Redireciona usuários não autenticados para /login ao acessar rotas protegidas.

11.6 – Frontend: next.config.js com headers de segurança
Arquivo: apps/frontend/next.config.js

11.7 – Frontend: .env.production
Arquivo: apps/frontend/.env.production

11.10 – Checklist de Validações e Segurança
Área	O que foi feito
Autenticação	JWT com refresh token, bcrypt (12 rounds), guards de role
Validação de entrada	class-validator em todos os DTOs, whitelist: true no ValidationPipe global
Headers HTTP	Helmet no backend, headers de segurança no Next.js
CORS	Restrito à URL do frontend
Rate limiting	Express-rate-limit: 200 req/15min por IP
Tratamento de erros	Filtro global que não expõe stack em produção
Respostas padronizadas	Interceptor { success, data, timestamp }
Upload	Validação de tipo (imagens), limite de tamanho (5 MB), nomes aleatórios
Senhas	Hash bcrypt com salt 12, nunca retornadas na API
Variáveis de ambiente	.env.example documentado, .env no .gitignore
Docker	Backend, frontend e banco em containers com volumes persistentes


11.11 – Instruções de Deploy
Opção 1 – VPS com Docker:

```
# Na raiz do projeto
docker-compose up -d --build

# Rodar migrações
docker exec marketplace-backend npm run migration:run
docker exec marketplace-backend npm run seed
```

Opção 2 – Vercel (frontend) + Railway (backend + banco):

Frontend: conectar repositório no Vercel, build automático, definir NEXT_PUBLIC_API_URL

Backend: deploy no Railway com PostgreSQL integrado, definir variáveis de ambiente

Opção 3 – Servidor dedicado:

Backend: npm run build && npm run start com PM2

Frontend: npm run build && npm run start com PM2

Banco: PostgreSQL em servidor próprio

Nginx como proxy reverso com HTTPS (Let's Encrypt)



✅ Etapa 11 concluída – Projeto Finalizado

# Marketplace - Projeto Completo

Plataforma de marketplace multi-vendedor, inspirada em Mercado Livre, Shopee e OLX.

## Tecnologias
- **Frontend:** Next.js 14, React 18, Tailwind CSS, Axios, React Query
- **Backend:** NestJS, TypeORM, PostgreSQL, JWT, Multer
- **Infra:** Docker, Docker Compose

## Funcionalidades
- 🔐 Autenticação JWT com refresh token
- 👥 Tipos de conta: Comprador, Vendedor, Administrador
- 📦 CRUD de produtos com variações e upload de imagens
- 🛒 Carrinho de compras
- 📋 Pedidos com máquina de estados
- 💳 Pagamentos com interface desacoplada (Mercado Pago / Fake)
- ⭐ Avaliações de produtos e vendedores
- 🔍 Busca e filtros com paginação
- 📊 Painel do Vendedor (dashboard, produtos, vendas)
- 🛡️ Painel Administrativo (gerenciar usuários, produtos, pedidos)

## Estrutura

marketplace/
├── apps/
│ ├── backend/ # NestJS API REST
│ └── frontend/ # Next.js App Router
├── docker-compose.yml
└── README.md


## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- PostgreSQL 16+ (ou Docker)
- Git

### Passos
```
1. Clone o repositório
2. Backend:
   ```bash
   cd apps/backend
   cp .env.example .env
   npm install
   npm run migration:run
   npm run seed
   npm run dev

   ```

Frontend:

```
cd apps/frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Acesse http://localhost:3000

**Docker**

```
docker-compose up -d --build
docker exec marketplace-backend npm run migration:run
docker exec marketplace-backend npm run seed
```

Status do Projeto
✅ Etapa 1 - Setup do Monorepo (NestJS + Next.js)
✅ Etapa 2 - Banco de Dados (TypeORM + PostgreSQL + Seeds)
✅ Etapa 3 - Autenticação (JWT, Guards, Perfil de Usuário)
✅ Etapa 4 - Produtos e Categorias (CRUD, Listagem, Filtros, Paginação)
✅ Etapa 5 - Upload de Imagens (Local + Abstração p/ Cloudinary/Supabase/Firebase/S3)
✅ Etapa 6 - Carrinho e Pedidos (Adicionar, Finalizar, Status, Estoque)
✅ Etapa 7 - Pagamentos (Interface desacoplada, Mercado Pago, Fake Gateway)
✅ Etapa 8 - Frontend Público (Home, Busca, Produto, Carrinho, Checkout, Pedidos, Perfil)
✅ Etapa 9 - Painel do Vendedor (Dashboard, Produtos c/ Upload, Vendas, Loja)
✅ Etapa 10 - Painel Administrativo (Dashboard, Gerenciar Usuários/Produtos/Pedidos, Logs)
✅ Etapa 11 - Segurança, Validações e Deploy (Helmet, Rate Limit, Docker, .env.example)

Admin padrão
Email: admin@marketplace.com

Senha: Admin123!


---

### 🎉 Projeto completo!

As 11 etapas foram concluídas:

| # | Etapa | Status |
|---|-------|--------|
| 1 | Setup do Monorepo | ✅ |
| 2 | Banco de Dados | ✅ |
| 3 | Autenticação | ✅ |
| 4 | Produtos e Categorias | ✅ |
| 5 | Upload de Imagens | ✅ |
| 6 | Carrinho e Pedidos | ✅ |
| 7 | Pagamentos | ✅ |
| 8 | Frontend Público | ✅ |
| 9 | Painel do Vendedor | ✅ |
| 10 | Painel Administrativo | ✅ |
| 11 | Segurança, Validações e Deploy | ✅ |

O marketplace está **pronto para produção**. Agora é só ajustar detalhes visuais, configurar um gateway de pagamento real, colocar no ar e começar a vender! 🚀
