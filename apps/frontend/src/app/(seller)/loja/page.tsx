'use client';

import React, { useEffect, useState } from 'react';
import { sellersAPI } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function StorePage() {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    sellersAPI.getStore()
      .then((res) => {
        setStoreName(res.data.storeName || '');
        setDescription(res.data.description || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await sellersAPI.updateStore({ storeName, description });
      alert('Loja atualizada!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro');
    } finally {
      setSaving(false);
    }
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Minha Loja</h1>
      <form onSubmit={handleSave} className="bg-white p-6 rounded-xl shadow-sm border space-y-4 max-w-lg">
        <Input label="Nome da Loja" value={storeName} onChange={(e) => setStoreName(e.target.value)} required />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <Button type="submit" loading={saving}>Salvar</Button>
      </form>
    </div>
  );
}
