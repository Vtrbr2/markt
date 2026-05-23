import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Marketplace</h3>
            <p className="text-sm">Sua plataforma de compras online.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-3">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/busca" className="hover:text-white">Produtos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-3">Contato</h4>
            <p className="text-sm">contato@marketplace.com</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          © 2024 Marketplace. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
