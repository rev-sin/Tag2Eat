import { NextResponse } from "next/server";

const channelId = process.env.THINGSPEAK_CHANNEL_ID; // e.g. "2702587"

export async function GET() {
  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/fields/1.json?results=10`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "ThingSpeak fetch failed" },
        { status: 500 },
      );
    }

    const data = await res.json();
    const feeds = (data?.feeds ?? []).map(
      (f: { created_at?: string; field1?: unknown }) => ({
        created_at: f.created_at ?? "",
        value: String(f.field1 ?? ""),
      }),
    );

    return NextResponse.json({ feeds });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
