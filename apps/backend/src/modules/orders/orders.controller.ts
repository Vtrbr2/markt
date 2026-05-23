import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  /**
   * Criar pedido (comprador).
   */
  @Post()
  async create(@Req() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.createFromCart(req.user.userId, dto);
  }

  /**
   * Meus pedidos (comprador).
   */
  @Get()
  async findMyOrders(@Req() req) {
    return this.ordersService.findByBuyer(req.user.userId);
  }

  /**
   * Minhas vendas (vendedor).
   */
  @Get('sales')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SELLER)
  async findMySales(@Req() req) {
    return this.ordersService.findBySeller(req.user.userId);
  }

  /**
   * Detalhes de um pedido.
   */
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    const order = await this.ordersService.findOne(id);
    // Verificar se o usuário é comprador, vendedor ou admin do pedido
    if (
      req.user.role !== UserRole.ADMIN &&
      order.buyer.id !== req.user.userId &&
      order.sellerId !== req.user.userId
    ) {
      throw new Error('Acesso negado'); // Ideal usar um Guard específico
    }
    return order;
  }

  /**
   * Atualizar status do pedido.
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req,
  ) {
    return this.ordersService.updateStatus(id, dto.status, req.user.userId, req.user.role);
  }
}
