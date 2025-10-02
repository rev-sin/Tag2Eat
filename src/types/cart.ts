
export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  total: () => number;
  clearCart: () => void;
  resetCart: () => void;
}
