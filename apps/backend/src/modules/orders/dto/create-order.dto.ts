import { IsUUID, IsOptional, IsObject, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  addressId?: string; // ID de endereço salvo

  @IsOptional()
  @IsObject()
  shippingAddress?: {
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    zipCode: string;
  };

  @IsOptional()
  @IsString()
  paymentMethod?: string; // ex: 'credit_card', 'pix', 'boleto'
}
