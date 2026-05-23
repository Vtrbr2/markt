import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentResult } from './payment-gateway.interface';
import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from '../entities/payment.entity';

@Injectable()
export class FakeGateway implements PaymentGateway {
  async createPayment(order: Order, method: PaymentMethod): Promise<PaymentResult> {
    // Simula pagamento sempre aprovado
    return {
      success: true,
      transactionId: `fake_${Date.now()}_${order.id.slice(0, 8)}`,
      status: 'approved',
      paymentUrl: method === 'credit_card' ? 'https://checkout.fake.com/pay' : undefined,
      pixCode: method === 'pix' ? '00020126330014BR.GOV.BCB.PIX0114fake-key-1234' : undefined,
      pixQrCode: method === 'pix' ? 'base64-qrcode-fake' : undefined,
      boletoUrl: method === 'boleto' ? 'https://boleto.fake.com/12345' : undefined,
    };
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentResult> {
    return {
      success: true,
      transactionId,
      status: 'approved',
    };
  }

  async handleWebhook(payload: any): Promise<PaymentResult> {
    return {
      success: true,
      transactionId: payload?.transactionId || `webhook_${Date.now()}`,
      status: 'approved',
    };
  }
}
