/** biome-ignore-all lint/style/useTemplate: ignore this */
/** biome-ignore-all lint/a11y/useButtonType: ignore this */
/** biome-ignore-all lint/suspicious/noExplicitAny: ignore this */

"use client";
import { useCartStore } from "@/lib/useCartStore";

export default function CheckoutButton() {
  const { total } = useCartStore();

  const handleCheckout = async () => {
    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      body: JSON.stringify({ amount: total(), currency: "INR" }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Your App Name",
      description: "Order Payment",
      order_id: order.id,
      handler: (response: any) => {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <button
      onClick={handleCheckout}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      Pay with Razorpay
    </button>
  );
}
