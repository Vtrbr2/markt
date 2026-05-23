import { IsUUID, IsEnum } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';

export class CheckoutDto {
  @IsUUID()
  orderId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
