'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setData(res.data));
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    { label: 'Usuários', value: data.totalUsers, color: 'bg-blue-50 text-blue-700' },
    { label: 'Produtos', value: data.totalProducts, color: 'bg-green-50 text-green-700' },
    { label: 'Pedidos', value: data.totalOrders, color: 'bg-purple-50 text-purple-700' },
    {
      label: 'Faturamento',
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.totalRevenue),
      color: 'bg-orange-50 text-orange-700',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`p-6 rounded-xl shadow-sm border ${card.color}`}>
            <p className="text-sm opacity-75">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos Recentes</h2>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Pedido</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Comprador</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders?.map((order: any) => (
              <tr key={order.id} className="border-t">
                <td className="p-4">#{order.id.slice(0, 8)}</td>
                <td className="p-4">{order.buyer?.name}</td>
                <td className="p-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</td>
                <td className="p-4 capitalize">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
