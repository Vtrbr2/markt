'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { productsAPI, categoriesAPI } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUploader from './ImageUploader';
import { Category } from '@/types';

interface ProductFormProps {
  product?: any; // undefined = criar, objeto = editar
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [stock, setStock] = useState(product?.stock?.toString() || '0');
  const [categoryId, setCategoryId] = useState(product?.category?.id || '');
  const [images, setImages] = useState<any[]>(
    product?.images?.map((img: any) => ({ url: img.url, key: img.url, isPrimary: img.isPrimary })) || [],
  );

  useEffect(() => {
    categoriesAPI.list().then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: categoryId || undefined,
        images: images.map((img, i) => ({ url: img.url, isPrimary: i === 0, order: i })),
      };

      if (isEditing) {
        await productsAPI.update(product.id, data);
      } else {
        await productsAPI.create(data as any);
      }
      router.push('/produtos');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h2 className="text-xl font-bold">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>

        <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Preço (R$)" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <Input label="Estoque" type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagens</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>
          {isEditing ? 'Salvar Alterações' : 'Publicar Produto'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
