'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsAPI } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Product } from '@/types';

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productsAPI.getById(id as string).then((res) => setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    try {
      await addItem(product!.id, quantity);
      alert('Adicionado ao carrinho!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao adicionar');
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagens */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage]?.url || '/placeholder.png'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div>
          <p className="text-sm text-gray-500">{product.seller?.storeName || 'Marketplace'}</p>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.title}</h1>
          <p className="text-3xl font-bold text-gray-900 mt-4">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </p>
          <p className="mt-4 text-gray-600">{product.description}</p>
          <p className="mt-2 text-sm text-gray-500">Estoque: {product.stock} unidades</p>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 hover:bg-gray-100">-</button>
                <span className="px-4 py-2">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 hover:bg-gray-100">+</button>
              </div>
              <Button onClick={handleAddToCart} loading={adding} className="flex-1">
                Adicionar ao Carrinho
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
