
import { create } from "zustand";
import type { CartStore, CartItem } from "@/types/cart";

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item: CartItem) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  removeItem: (id: number) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  clearCart: () => set({ items: [] }),
  resetCart: () => set({ items: [] }),
  increaseQty: (id: number) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),
  decreaseQty: (id: number) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    })),
  updateQuantity: (id: number, qty: number) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(qty, 1) } : i,
      ),
    })),
  total: () =>
    get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
}));
