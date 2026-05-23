import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  async getCart(@Req() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  async addItem(@Req() req, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.userId, dto);
  }

  @Put('items/:id')
  async updateItem(@Req() req, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItemQuantity(req.user.userId, id, dto);
  }

  @Delete('items/:id')
  async removeItem(@Req() req, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.userId, id);
  }
}
