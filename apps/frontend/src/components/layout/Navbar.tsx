'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/busca?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Marketplace
          </Link>

          {/* Busca */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700">
              🔍
            </button>
          </form>

          {/* Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/carrinho" className="relative text-gray-700 hover:text-blue-600">
                  🛒
                  {cart && cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cart.totalItems}
                    </span>
                  )}
                </Link>
                <Link href="/meus-pedidos" className="text-gray-700 hover:text-blue-600">
                  Meus Pedidos
                </Link>
                <Link href="/perfil" className="text-gray-700 hover:text-blue-600">
                  {user?.name?.split(' ')[0]}
                </Link>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">Entrar</Button>
                </Link>
                <Link href="/cadastro">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
