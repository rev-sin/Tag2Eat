import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    if (!uid)
      return NextResponse.json({ error: "Missing uid" }, { status: 400 });

    // Find user by rf_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("rf_id", uid)
      .maybeSingle();

    if (userError)
      return NextResponse.json({ error: userError.message }, { status: 500 });

    if (!userData) return NextResponse.json({ orders: [] });

    type UserRow = { id: number } | null;
    const userRow = userData as UserRow;
    const userId = userRow?.id;
    if (!userId) return NextResponse.json({ orders: [] });

    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select(
        `id, status, created_at, order_items(id, menu_id, quantity, menu(name, price))`,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (ordersError)
      return NextResponse.json({ error: ordersError.message }, { status: 500 });

    return NextResponse.json({ orders: orders || [] });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
