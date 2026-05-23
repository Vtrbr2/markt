import { Controller, Post, Get, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  /**
   * Inicia checkout de um pedido.
   * POST /api/payments/checkout
   */
  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async checkout(@Req() req, @Body() dto: CheckoutDto) {
    return this.paymentsService.checkout(req.user.userId, dto);
  }

  /**
   * Webhook para receber notificações do gateway.
   * POST /api/payments/webhook
   * Rota pública (sem autenticação), validada pelo gateway via assinatura/ip
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() payload: any) {
    return this.paymentsService.handleWebhook(payload);
  }

  /**
   * Consulta status de um pagamento.
   * GET /api/payments/:id
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Req() req, @Param('id') id: string) {
    return this.paymentsService.getPaymentStatus(id, req.user.userId);
  }
}
