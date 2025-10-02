/** biome-ignore-all lint/a11y/useButtonType: ignore this */
"use client";

import { useCartStore } from "@/lib/useCartStore";
import CheckoutButton from "./CheckoutButton";

export default function CartTable() {
  const { items, increaseQty, decreaseQty, removeItem, clearCart } =
    useCartStore();

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <p className="text-gray-500 mt-8 text-center">Your cart is empty.</p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {/* Responsive wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                Item
              </th>
              <th className="border-b border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                Price
              </th>
              <th className="border-b border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                Total
              </th>
              <th className="border-b border-gray-300 px-4 py-2 text-center text-sm font-semibold">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 text-center">
                <td className="border-b border-gray-200 px-4 py-2 text-sm">
                  {item.name}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-sm">
                  ₹{item.price}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-sm">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="border-b border-gray-200 px-4 py-2 text-sm">
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? decreaseQty(item.id)
                          : removeItem(item.id)
                      }
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                    >
                      -
                    </button>

                    <span className="px-2">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart footer */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</p>
        <div className="space-x-2">
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
          >
            Clear Cart
          </button>
          <CheckoutButton />
        </div>
      </div>
    </div>
  );
}
