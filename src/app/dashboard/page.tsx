/** biome-ignore-all lint/suspicious/noArrayIndexKey: ignore this */
"use client";

import { useEffect, useState } from "react";

type Feed = {
  created_at: string;
  value: string;
};

type Menu = {
  name: string;
  price: number;
};

type OrderItem = {
  id: number;
  menu_id: number;
  quantity: number;
  menu?: Menu;
};

type Order = {
  id: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

export default function Dashboard() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/thingspeak");
      const data = await res.json();
      setFeeds(data.feeds || []);
      setLoading(false);
      // fetch orders for the most recent UID (if any)
      if (data.feeds && data.feeds.length > 0) {
        const latest = data.feeds[0];
        const uid = latest.value;
        if (uid) {
          setOrdersLoading(true);
          try {
            const ordRes = await fetch(
              `/api/orders/by-uid?uid=${encodeURIComponent(uid)}`,
            );
            const ordData = await ordRes.json();
            setOrders(ordData.orders || []);
          } catch (e) {
            // log and clear orders on error
            // eslint-disable-next-line no-console
            console.error(e);
            setOrders([]);
          } finally {
            setOrdersLoading(false);
          }
        }
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ThingSpeak Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Time</th>
              <th className="p-2 border">UID</th>
            </tr>
          </thead>
          <tbody>
            {feeds.map((f, i) => (
              <tr key={i}>
                <td className="p-2 border">
                  {new Date(f.created_at).toLocaleString()}
                </td>
                <td className="p-2 border font-mono">{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Orders for latest UID</h2>
        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found for the latest UID.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <div className="font-medium">Order #{order.id}</div>
                  <div className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {order.status}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(order.created_at).toLocaleString()}
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Item</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.menu?.name || "Unknown"}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">₹{item.menu?.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right font-semibold mt-2">
                  Total: ₹
                  {order.order_items?.reduce(
                    (acc, item) =>
                      acc + (item.menu?.price || 0) * item.quantity,
                    0,
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
