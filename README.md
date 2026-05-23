
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
