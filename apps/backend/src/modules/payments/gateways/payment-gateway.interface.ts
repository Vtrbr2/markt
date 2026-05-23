import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from '../entities/payment.entity';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;     // ID externo do gateway
  status: 'pending' | 'approved' | 'refused';
  paymentUrl?: string;        // Link para checkout externo (cartão)
  pixCode?: string;           // Código Pix copia-e-cola
  pixQrCode?: string;         // QR Code base64 (Pix)
  boletoUrl?: string;         // URL do boleto
}

export interface PaymentGateway {
  /**
   * Cria uma transação de pagamento no gateway externo.
   * @param order - Pedido com itens e total
   * @param method - Método de pagamento escolhido
   */
  createPayment(order: Order, method: PaymentMethod): Promise<PaymentResult>;

  /**
   * Consulta o status de um pagamento no gateway.
   * @param transactionId - ID retornado pelo gateway
   */
  getPaymentStatus(transactionId: string): Promise<PaymentResult>;

  /**
   * Processa notificação (webhook) do gateway.
   * @param payload - Dados recebidos do webhook
   */
  handleWebhook(payload: any): Promise<PaymentResult>;
}
