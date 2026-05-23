import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // vamos adicionar depois, mas aqui já pré-configuramos

// Módulos vazios que serão preenchidos nas próximas etapas
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT!,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true, // carrega entidades automaticamente
        synchronize: false, // usaremos migrações
        logging: true,
      }),
    }),
    // Os módulos de negócio serão importados aqui futuramente
  ],
})
export class AppModule {}
