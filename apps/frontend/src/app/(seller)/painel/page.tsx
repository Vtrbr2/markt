'use client';

import React, { useEffect, useState } from 'react';
import { sellersAPI } from '@/services/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sellersAPI.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData({ totalProducts: 0, totalSales: 0, totalRevenue: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cards = [
    { label: 'Produtos', value: data?.totalProducts || 0, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'Vendas', value: data?.totalSales || 0, icon: '💰', color: 'bg-green-50 text-green-700' },
    { label: 'Faturamento', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data?.totalRevenue || 0), icon: '📈', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`p-6 rounded-xl shadow-sm border ${card.color}`}>
            <p className="text-3xl mb-2">{card.icon}</p>
            <p className="text-sm opacity-75">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
