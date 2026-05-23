'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <div>
          <p className="text-sm text-gray-500">Nome</p>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tipo de Conta</p>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
        <Button variant="danger" onClick={logout} className="w-full mt-4">
          Sair
        </Button>
      </div>
    </div>
  );
}
