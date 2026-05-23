'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI, paymentsAPI } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function CheckoutPage() {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [address, setAddress] = useState({
    street: '', number: '', city: '', state: '', zipCode: '',
  });

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Criar pedido
      const orderRes = await ordersAPI.create({
        shippingAddress: address,
        paymentMethod,
      });
      const order = orderRes.data;

      // 2. Iniciar pagamento
      const payRes = await paymentsAPI.checkout(order.id, paymentMethod);
      const checkoutData = payRes.data;

      // 3. Redirecionar ou mostrar código
      if (checkoutData.paymentUrl) {
        window.location.href = checkoutData.paymentUrl;
      } else if (checkoutData.pixCode) {
        alert(`Código Pix: ${checkoutData.pixCode}`);
        router.push(`/meus-pedidos`);
      } else {
        router.push(`/meus-pedidos`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao finalizar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Endereço */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-medium mb-4">Endereço de Entrega</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Rua" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            <Input label="Número" value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} required />
            <Input label="Cidade" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
            <Input label="Estado" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
            <Input label="CEP" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} required />
          </div>
        </div>

        {/* Pagamento */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-medium mb-4">Método de Pagamento</h2>
          <div className="space-y-3">
            {[
              { value: 'pix', label: 'Pix' },
              { value: 'credit_card', label: 'Cartão de Crédito' },
              { value: 'boleto', label: 'Boleto' },
            ].map((method) => (
              <label key={method.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span>{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="font-medium mb-4">Resumo</h2>
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart?.subtotal || 0)}</span>
          </div>
        </div>

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Pagar
        </Button>
      </form>
    </div>
  );
}
