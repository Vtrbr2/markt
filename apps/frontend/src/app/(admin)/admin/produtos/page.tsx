'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

const statusOptions = ['active', 'paused', 'sold', 'under_review'];

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const loadProducts = () => {
    const params = filter ? `?status=${filter}` : '';
    api.get(`/admin/products${params}`).then((res) => setProducts(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => loadProducts(), [filter]);

  const handleStatusChange = async (productId: string, status: string) => {
    await api.patch(`/admin/products/${productId}/status`, { status });
    loadProducts();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Produtos</h1>
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todos os status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Produto</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Vendedor</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Preço</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={product.images?.[0]?.url || '/placeholder.png'} alt="" className="w-10 h-10 rounded object-cover" />
                    <span className="font-medium text-sm">{product.title}</span>
                  </div>
                </td>
                <td className="p-4 text-sm">{product.seller?.storeName}</td>
                <td className="p-4 text-sm">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-100 text-green-700' :
                    product.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
