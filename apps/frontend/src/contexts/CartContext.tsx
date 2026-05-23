'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { cartAPI } from '@/services/api';
import { Cart } from '@/types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: string, quantity: number, variation?: Record<string, string>) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) refreshCart();
  }, [isAuthenticated, refreshCart]);

  const addItem = async (productId: string, quantity: number, variation?: Record<string, string>) => {
    const { data } = await cartAPI.addItem(productId, quantity, variation);
    setCart(data);
  };

  const updateItem = async (itemId: string, quantity: number) => {
    const { data } = await cartAPI.updateItem(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId: string) => {
    const { data } = await cartAPI.removeItem(itemId);
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
