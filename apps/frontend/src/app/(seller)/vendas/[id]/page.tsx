'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ordersAPI } from '@/services/api';
import { Order } from '@/types';
import Button from '@/components/ui/Button';

const nextStatus: Record<string, string> = {
  paid: 'preparing',
  preparing: 'shipped',
};

const nextLabel: Record<string, string> = {
  paid: 'Marcar como Preparando',
  preparing: 'Marcar como Enviado',
};

export default function SaleDetailPage() {
  const { id } = useParams();
  const [sale, setSale] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSale = () => {
    ordersAPI.getById(id as string)
      .then((res) => setSale(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadSale(), [id]);

  const handleUpdateStatus = async () => {
    if (!sale || !nextStatus[sale.status]) return;
    try {
      await ordersAPI.updateStatus(sale.id, nextStatus[sale.status]);
      loadSale();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao atualizar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sale) return <p>Venda não encontrada.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedido #{sale.id.slice(0, 8)}</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium capitalize">{sale.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-bold text-xl">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-2">Itens</p>
          {sale.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-t">
              <span>{item.productSnapshot.title} x{item.quantity}</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
        {nextStatus[sale.status] && (
          <Button onClick={handleUpdateStatus} className="w-full">
            {nextLabel[sale.status]}
          </Button>
        )}
      </div>
    </div>
  );
}
