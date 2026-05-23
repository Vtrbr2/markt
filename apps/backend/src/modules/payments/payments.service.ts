import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { PaymentGateway, PaymentResult } from './gateways/payment-gateway.interface';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @Inject('PAYMENT_GATEWAY')
    private gateway: PaymentGateway,
  ) {}

  /**
   * Inicia o checkout de um pedido.
   */
  async checkout(userId: string, dto: CheckoutDto) {
    const order = await this.orderRepository.findOne({
      where: { id: dto.orderId },
      relations: ['buyer', 'items', 'items.product'],
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');
    if (order.buyer.id !== userId) throw new ForbiddenException('Este pedido não é seu');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Este pedido não pode ser pago. Status atual: ' + order.status);
    }

    // Verificar se já existe pagamento
    const existingPayment = await this.paymentRepository.findOne({
      where: { order: { id: order.id } },
    });
    if (existingPayment && existingPayment.status === PaymentStatus.APPROVED) {
      throw new BadRequestException('Este pedido já foi pago');
    }

    // Criar pagamento no gateway
    const result: PaymentResult = await this.gateway.createPayment(order, dto.method);

    // Salvar pagamento no banco
    const payment = existingPayment || this.paymentRepository.create();
    payment.order = order;
    payment.method = dto.method;
    payment.gateway = 'mercadopago'; // ou dinâmico baseado na config
    payment.transactionId = result.transactionId;
    payment.status = result.status === 'approved' ? PaymentStatus.APPROVED : PaymentStatus.PENDING;
    payment.amount = Number(order.total);

    const savedPayment = await this.paymentRepository.save(payment);

    // Se pagamento já aprovado, atualizar pedido
    if (result.status === 'approved') {
      order.status = OrderStatus.PAID;
      await this.orderRepository.save(order);
    }

    return {
      payment: {
        id: savedPayment.id,
        status: savedPayment.status,
        method: savedPayment.method,
        amount: savedPayment.amount,
      },
      // Dados para o frontend redirecionar ou exibir
      paymentUrl: result.paymentUrl,
      pixCode: result.pixCode,
      pixQrCode: result.pixQrCode,
      boletoUrl: result.boletoUrl,
    };
  }

  /**
   * Processa webhook do gateway.
   */
  async handleWebhook(payload: any) {
    const result: PaymentResult = await this.gateway.handleWebhook(payload);

    if (!result.transactionId) {
      throw new BadRequestException('Transaction ID não encontrado no webhook');
    }

    const payment = await this.paymentRepository.findOne({
      where: { transactionId: result.transactionId },
      relations: ['order'],
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado para transactionId: ' + result.transactionId);
    }

    // Atualizar status do pagamento
    const newStatus =
      result.status === 'approved'
        ? PaymentStatus.APPROVED
        : result.status === 'refused'
          ? PaymentStatus.REFUSED
          : PaymentStatus.PENDING;

    payment.status = newStatus;
    if (newStatus === PaymentStatus.APPROVED && !payment.paidAt) {
      payment.paidAt = new Date();
    }
    await this.paymentRepository.save(payment);

    // Atualizar pedido se pagamento aprovado
    if (newStatus === PaymentStatus.APPROVED && payment.order.status === OrderStatus.PENDING) {
      payment.order.status = OrderStatus.PAID;
      await this.orderRepository.save(payment.order);
    }

    return { success: true, status: payment.status };
  }

  /**
   * Consulta status de um pagamento.
   */
  async getPaymentStatus(paymentId: string, userId: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId },
      relations: ['order', 'order.buyer'],
    });

    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    if (payment.order.buyer.id !== userId) throw new ForbiddenException('Acesso negado');

    return {
      id: payment.id,
      orderId: payment.order.id,
      status: payment.status,
      method: payment.method,
      amount: payment.amount,
      paidAt: payment.paidAt,
    };
  }
}
