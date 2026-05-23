'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { sellersAPI } from '@/services/api';
import { Order } from '@/types';

const statusLabels: Record<string, string> = {
  pending: 'Pendente', paid: 'Pago', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregue', canceled: 'Cancelado',
};

export default function SalesPage() {
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sellersAPI.getSales()
      .then((res) => setSales(res.data))
      .finally(() => setLoading(false));
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minhas Vendas</h1>
      {sales.length === 0 ? (
        <p className="text-gray-500">Nenhuma venda realizada.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Pedido</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Data</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id} className="border-t">
                  <td className="p-4">
                    <Link href={`/vendas/${sale.id}`} className="text-blue-600 hover:underline">
                      #{sale.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="p-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.total)}</td>
                  <td className="p-4">{statusLabels[sale.status]}</td>
                  <td className="p-4">{new Date(sale.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
