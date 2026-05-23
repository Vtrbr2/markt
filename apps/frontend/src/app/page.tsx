'use client';

import React, { useEffect, useState } from 'react';
import { productsAPI, categoriesAPI } from '@/services/api';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, Category } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productsAPI.list({ limit: 20, sort: 'recent' }),
      categoriesAPI.list(),
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data.data);
        setCategories(catRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Categorias */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorias</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/busca?category=${cat.id}`}
              className="flex-shrink-0 px-5 py-3 bg-white rounded-lg shadow-sm border hover:border-blue-500 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Produtos em Destaque</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </div>
  );
}
