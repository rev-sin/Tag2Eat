"use client";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function OrdersPage() {
  const { user } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      // First, get the internal user id from clerk_id
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();
      if (userError || !userData) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const userId = userData.id;
      let ordersQuery = supabase
        .from("orders")
        .select(
          "id, status, created_at, order_items(id, menu_id, quantity, menu(name, price))",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (orderId) {
        ordersQuery = ordersQuery.eq("id", orderId);
      }
      const { data, error } = await ordersQuery;
      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user, orderId]);

  if (!user) {
    return (
      <div className="p-8 text-center">Please sign in to view your orders.</div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="p-8 text-center">No orders found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-lg mb-6 p-4 bg-white shadow"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Order #{order.id}</span>
            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
              {order.status}
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            Placed: {new Date(order.created_at).toLocaleString()}
          </div>
          <table className="w-full text-sm mb-2">
            <thead>
              <tr>
                <th className="text-left">Item</th>
                <th className="text-right">Qty</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.menu?.name || "Unknown"}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">₹{item.menu?.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-semibold">
            Total: ₹
            {order.order_items?.reduce(
              (acc: number, item: any) =>
                acc + (item.menu?.price || 0) * item.quantity,
              0,
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
