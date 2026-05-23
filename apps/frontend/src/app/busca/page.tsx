'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { productsAPI, categoriesAPI } from '@/services/api';
import ProductGrid from '@/components/product/ProductGrid';
import { Product, Category } from '@/types';

function BuscaContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });

  const q = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'recent';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    setLoading(true);
    productsAPI.list({ search: q, categoryId, sort, page, limit: 20 })
      .then((res) => {
        setProducts(res.data.data);
        setMeta(res.data.meta);
      })
      .finally(() => setLoading(false));
  }, [q, categoryId, sort, page]);

  useEffect(() => {
    categoriesAPI.list().then((res) => setCategories(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {q ? `Resultados para "${q}"` : 'Todos os Produtos'}
      </h1>
      <div className="flex gap-6">
        {/* Filtros */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="bg-white p-4 rounded-xl shadow-sm border sticky top-20">
            <h3 className="font-medium mb-3">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <a href={`/busca?q=${q}&sort=${sort}`} className={`text-sm ${!categoryId ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}>
                  Todas
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/busca?q=${q}&category=${cat.id}&sort=${sort}`}
                    className={`text-sm ${categoryId === cat.id ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Resultados */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">{meta.total} produto(s) encontrado(s)</p>
              <ProductGrid products={products} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuscaPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}>
      <BuscaContent />
    </Suspense>
  );
}
