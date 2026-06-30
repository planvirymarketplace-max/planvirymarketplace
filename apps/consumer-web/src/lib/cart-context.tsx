'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';

// ===========================================================================
// Planviry Unified Cart — Part 41 (Extended Cart Type Contract)
// ===========================================================================
export type CartItemType =
  | 'booking'
  | 'ticket'
  | 'lodging'
  | 'experience'
  | 'restaurant'
  | 'external_event';

export interface CartItem {
  id: string;
  type: CartItemType;
  listing_id: string | null;
  vendor_id: string | null;
  name: string;
  image_url?: string | null;
  date: string;
  start_date?: string;
  end_date?: string;
  vendor_name?: string;
  vendor_slug?: string;
  package_id?: string;
  package_name?: string;
  amount: number;
  deposit_amount?: number;
  quantity?: number;
  experience_slot_id?: string;
  restaurant_id?: string;
  party_size?: number;
  reservation_time?: string;
  external_event_id?: string;
  ticket_url?: string;
  category?: string | null;
}

export function requiresStripeCharge(item: CartItem): boolean {
  if (item.type === 'external_event') return false;
  if (item.type === 'restaurant' && (!item.amount || item.amount === 0)) return false;
  return true;
}

export function cartItemId(
  type: CartItemType,
  listing_id: string | null,
  suffix: string,
): string {
  return `${type}-${listing_id ?? 'none'}-${suffix}`;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  totalAmount: number;
  totalDeposit: number;
  itemCount: number;
  chargeableItems: CartItem[];
  nonChargeableItems: CartItem[];
  groupedByVendor: Record<string, CartItem[]>;
  groupedByType: Record<CartItemType, CartItem[]>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const chargeableItems = useMemo(
    () => items.filter(requiresStripeCharge),
    [items],
  );

  const nonChargeableItems = useMemo(
    () => items.filter((i) => !requiresStripeCharge(i)),
    [items],
  );

  const totalAmount = useMemo(
    () => chargeableItems.reduce((sum, i) => sum + i.amount, 0),
    [chargeableItems],
  );

  const totalDeposit = useMemo(
    () => chargeableItems.reduce((sum, i) => sum + (i.deposit_amount ?? 0), 0),
    [chargeableItems],
  );

  const itemCount = useMemo(() => items.length, [items]);

  const groupedByVendor = useMemo(() => {
    const map: Record<string, CartItem[]> = {};
    for (const item of items) {
      const key = item.vendor_id ?? 'external';
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return map;
  }, [items]);

  const groupedByType = useMemo(() => {
    const map: Record<CartItemType, CartItem[]> = {
      booking: [],
      ticket: [],
      lodging: [],
      experience: [],
      restaurant: [],
      external_event: [],
    };
    for (const item of items) {
      map[item.type].push(item);
    }
    return map;
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      removeItem,
      updateItem,
      clearCart,
      totalAmount,
      totalDeposit,
      itemCount,
      chargeableItems,
      nonChargeableItems,
      groupedByVendor,
      groupedByType,
    }),
    [
      items, addItem, removeItem, updateItem, clearCart,
      totalAmount, totalDeposit, itemCount, chargeableItems,
      nonChargeableItems, groupedByVendor, groupedByType,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a <CartProvider>');
  }
  return ctx;
}
