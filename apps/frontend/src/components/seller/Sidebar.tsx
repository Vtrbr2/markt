'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const menuItems = [
  { href: '/painel', label: 'Dashboard', icon: '📊' },
  { href: '/produtos', label: 'Produtos', icon: '📦' },
  { href: '/produtos/novo', label: 'Novo Produto', icon: '➕' },
  { href: '/vendas', label: 'Vendas', icon: '💰' },
  { href: '/loja', label: 'Minha Loja', icon: '🏪' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] p-4 flex-shrink-0">
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
