export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  increaseQty: (id: number) => void;
  decreaseQty: (id: number) => void;
  total: () => number;
};
