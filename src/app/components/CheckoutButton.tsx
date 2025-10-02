/** biome-ignore-all lint/a11y/useButtonType: ignore this */
/** biome-ignore-all lint/style/noNonNullAssertion: ignore this */
/** biome-ignore-all lint/style/useTemplate: ignore this */
/** biome-ignore-all assist/source/organizeImports: ignore this */
"use client";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useCartStore } from "@/lib/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CheckoutButton() {
  const { total, resetCart } = useCartStore();
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<{
    full_name: string;
    email: string;
    phone: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("full_name, email, phone")
        .eq("clerk_id", user.id)
        .single();

      if (!error && data) {
        setUserDetails(data);
      }
    };

    fetchUser();
  }, [user]);

  const handleCheckout = async () => {
    if (!user || !userDetails) {
      alert("Please sign in and make sure your profile is complete.");
      return;
    }

    const res = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total(), currency: "INR" }),
    });

    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Tag2Eat",
      description: "Order Payment",
      order_id: order.id,
      handler: (response: any) => {
        alert("Payment Successful! ID: " + response.razorpay_payment_id);
        // Insert order and items into DB
        fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id, // clerk_id
            items: useCartStore.getState().items,
            paymentId: response.razorpay_payment_id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              resetCart();
              setUserDetails(null);
              router.push(`/orders?orderId=${data.orderId}`);
            } else {
              alert(`Order DB insert failed: ${data.error || "Unknown error"}`);
            }
          });
      },
      prefill: {
        name: userDetails.full_name,
        email: userDetails.email,
        contact: userDetails.phone.startsWith("+91")
          ? userDetails.phone
          : `+91${userDetails.phone}`,
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
