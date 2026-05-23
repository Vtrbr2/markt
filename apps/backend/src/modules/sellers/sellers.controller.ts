import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entities/seller.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Controller('sellers')
export class SellersController {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyStore(@Req() req) {
    const seller = await this.sellersRepository.findOne({
      where: { user: { id: req.user.userId } },
      relations: ['user'],
    });
    return seller || {};
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateMyStore(@Req() req, @Body() body: { storeName?: string; description?: string; logoUrl?: string }) {
    let seller = await this.sellersRepository.findOne({
      where: { user: { id: req.user.userId } },
    });
    if (!seller) {
      seller = this.sellersRepository.create({
        user: { id: req.user.userId },
        storeName: body.storeName || 'Minha Loja',
        description: body.description || '',
        logoUrl: body.logoUrl || '',
      });
    } else {
      Object.assign(seller, body);
    }
    return this.sellersRepository.save(seller);
  }

  @Get('me/dashboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getDashboard(@Req() req) {
    const seller = await this.sellersRepository.findOne({
      where: { user: { id: req.user.userId } },
    });

    if (!seller) return { totalProducts: 0, totalSales: 0, totalRevenue: 0 };

    const totalProducts = await this.productsRepository.count({ where: { seller: { id: seller.id } } });
    const orders = await this.ordersRepository.find({ where: { sellerId: seller.id } });
    const totalSales = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status !== 'canceled')
      .reduce((sum, o) => sum + Number(o.total), 0);

    return { totalProducts, totalSales, totalRevenue };
  }

  @Get('me/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SELLER)
  async getMyProducts(@Req() req) {
    const seller = await this.sellersRepository.findOne({
      where: { user: { id: req.user.userId } },
    });
    if (!seller) return [];
    return this.productsRepository.find({
      where: { seller: { id: seller.id } },
      relations: ['images', 'category'],
      order: { createdAt: 'DESC' },
    });
  }
}
