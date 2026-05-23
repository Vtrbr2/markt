import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import helmet from 'helmet';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Segurança HTTP headers
  app.use(helmet());

  // CORS restrito (configure a origem do frontend)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Prefixo global
  app.setGlobalPrefix('api');

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Filtro de exceções global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Interceptor de resposta
  app.useGlobalInterceptors(new TransformInterceptor());

  // Arquivos estáticos (uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Rate limiting (básico via express-rate-limit)
  // Instale: npm install express-rate-limit
  const rateLimit = require('express-rate-limit');
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 200, // limite por IP
      message: { statusCode: 429, message: 'Muitas requisições, tente novamente mais tarde' },
    }),
  );

  await app.listen(process.env.PORT || 3001);
  console.log(`🚀 Backend rodando em http://localhost:${process.env.PORT || 3001}`);
}
bootstrap();
