'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    api.get('/admin/users').then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => loadUsers(), []);

  const handleRoleChange = async (userId: string, role: string) => {
    await api.patch(`/admin/users/${userId}/role`, { role });
    loadUsers();
  };

  const handleBan = async (userId: string) => {
    if (!confirm('Banir este usuário?')) return;
    await api.patch(`/admin/users/${userId}/ban`);
    loadUsers();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gerenciar Usuários</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Nome</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left p-4 text-sm font-medium text-gray-500">Role</th>
              <th className="text-right p-4 text-sm font-medium text-gray-500">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleBan(user.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Banir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
