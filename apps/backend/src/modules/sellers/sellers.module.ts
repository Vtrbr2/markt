import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersController } from './sellers.controller';
import { Seller } from './entities/seller.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seller, Product, Order])],
  controllers: [SellersController],
})
export class SellersModule {}
