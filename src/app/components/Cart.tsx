/** biome-ignore-all lint/a11y/useButtonType: ignore this */

"use client";

import { useCartStore } from "@/lib/useCartStore";

export default function Cart() {
  const { items, removeItem, increaseQty, decreaseQty, clearCart, total } =
    useCartStore();

  if (items.length === 0) {
    return <p className="p-4 text-gray-500">🛒 Your cart is empty</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <div className="p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  ₹{item.price} x {item.quantity} = ₹
                  {item.price * item.quantity}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>₹{total()}</span>
        </div>
        <button
          onClick={clearCart}
          className="mt-4 w-full bg-gray-700 text-white py-2 rounded"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
