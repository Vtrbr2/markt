import { IsUUID, IsNumber, Min, IsOptional, IsObject } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  variation?: Record<string, string>; // ex: { "color": "red", "size": "M" }
}
