'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsAPI } from '@/services/api';
import ProductForm from '@/components/seller/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getById(id as string)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <ProductForm product={product} />;
}
