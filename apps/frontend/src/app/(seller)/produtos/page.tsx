'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { sellersAPI, productsAPI } from '@/services/api';
import Button from '@/components/ui/Button';
import { Product } from '@/types';

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  paused: 'Pausado',
  sold: 'Vendido',
  under_review: 'Em Análise',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    sellersAPI.getProducts()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadProducts(), []);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    await productsAPI.delete(id);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Produtos</h1>
        <Link href="/produtos/novo">
          <Button>Novo Produto</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">Nenhum produto cadastrado.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Produto</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Preço</th>
                <th className="text-left p-4 text-sm font-medium text-gray-500">Estoque</th>
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
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {statusLabels[product.status] || product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/produtos/${product.id}/editar`} className="text-blue-600 hover:underline mr-3">
                      Editar
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
