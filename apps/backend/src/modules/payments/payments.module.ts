import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../orders/entities/order.entity';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { FakeGateway } from './gateways/fake.gateway';
// import { MercadoPagoGateway } from './gateways/mercado-pago.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Order])],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    {
      provide: 'PAYMENT_GATEWAY',
      useClass: FakeGateway,   // ← trocar para MercadoPagoGateway em produção
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
