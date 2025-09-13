/** biome-ignore-all lint/style/noNonNullAssertion: ignore this */

import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json(
      { error: "Error creating order" },
      { status: 500 },
    );
  }
}
