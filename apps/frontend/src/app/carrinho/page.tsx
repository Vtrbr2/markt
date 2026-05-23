'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrinho Vazio</h1>
        <p className="text-gray-500 mb-6">Seu carrinho está vazio.</p>
        <Link href="/">
          <Button>Ver Produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrinho</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-4 border-b last:border-0">
            <img
              src={item.product.images?.[0]?.url || '/placeholder.png'}
              alt={item.product.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.product.title}</h3>
              <p className="text-sm text-gray-500">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
              </p>
            </div>
            <div className="flex items-center border rounded-lg">
              <button onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 hover:bg-gray-100">-</button>
              <span className="px-3">{item.quantity}</span>
              <button onClick={() => updateItem(item.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100">+</button>
            </div>
            <p className="font-medium w-24 text-right">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.subtotal)}
            </p>
            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">🗑️</button>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-white rounded-xl shadow-sm border p-6 flex justify-between items-center">
        <div>
          <p className="text-gray-500">Total ({cart.totalItems} itens)</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cart.subtotal)}
          </p>
        </div>
        <Button size="lg" onClick={() => router.push('/checkout')}>
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
}
