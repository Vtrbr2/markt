import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentResult } from './payment-gateway.interface';
import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from '../entities/payment.entity';

@Injectable()
export class MercadoPagoGateway implements PaymentGateway {
  private accessToken: string;
  private baseUrl = 'https://api.mercadopago.com';

  constructor() {
    this.accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';
  }

  async createPayment(order: Order, method: PaymentMethod): Promise<PaymentResult> {
    // Implementação real usando fetch ou SDK do Mercado Pago
    // Exemplo simplificado:

    if (method === PaymentMethod.PIX) {
      // Criar pagamento Pix
      const response = await fetch(`${this.baseUrl}/v1/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction_amount: Number(order.total),
          payment_method_id: 'pix',
          payer: { email: order.buyer.email },
          description: `Pedido #${order.id.slice(0, 8)}`,
        }),
      });

      const data = await response.json();
      return {
        success: true,
        transactionId: data.id?.toString(),
        status: data.status === 'approved' ? 'approved' : 'pending',
        pixCode: data.point_of_interaction?.transaction_data?.qr_code,
        pixQrCode: data.point_of_interaction?.transaction_data?.qr_code_base64,
      };
    }

    // Cartão de crédito / boleto seguiriam padrão similar
    throw new Error(`Método ${method} ainda não implementado para Mercado Pago`);
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentResult> {
    const response = await fetch(`${this.baseUrl}/v1/payments/${transactionId}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    const data = await response.json();

    return {
      success: true,
      transactionId,
      status: data.status === 'approved' ? 'approved' : data.status === 'rejected' ? 'refused' : 'pending',
    };
  }

  async handleWebhook(payload: any): Promise<PaymentResult> {
    // Mercado Pago envia o ID do pagamento no campo data.id
    const paymentId = payload?.data?.id;
    if (!paymentId) {
      return { success: false, status: 'pending' };
    }
    return this.getPaymentStatus(paymentId.toString());
  }
}
