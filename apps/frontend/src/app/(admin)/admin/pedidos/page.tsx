'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

const statusLabels: Record<string, string> = {
  pending: 'Pendente', paid: 'Pago', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregue', canceled: 'Cancelado',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/orders').then((res) => setOrders(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Todos os Pedidos</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Pedido</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Comprador</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">#{order.id.slice(0, 8)}</td>
                <td className="p-4">{order.buyer?.name}</td>
                <td className="p-4">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                </td>
                <td className="p-4">{statusLabels[order.status] || order.status}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
