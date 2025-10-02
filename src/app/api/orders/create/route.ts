
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { CartItem } from "@/types/cart";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase env vars missing");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { userId, items, paymentId } = await req.json();
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();
    if (userError || !user) {
      return NextResponse.json({ error: userError?.message || "User not found" }, { status: 400 });
    }
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ user_id: user.id, status: "paid", payment_id: paymentId })
      .select()
      .single();
    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message || "Order insert failed" }, { status: 500 });
    }
    const orderItems = (items as CartItem[]).map((item) => ({
      order_id: order.id,
      menu_id: item.id,
      quantity: item.quantity,
    }));
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
