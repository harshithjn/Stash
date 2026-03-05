import { NextResponse } from "next/server";

// Helper function to fetch from CoinGecko
async function fetchAsset(symbol: string) {
  const coinId = symbol.toLowerCase();
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&market_data=true`
  );
  if (!res.ok) throw new Error(`Failed to fetch asset: ${coinId}`);
  return res.json();
}

// ✅ FIX: Await the params promise before accessing symbol
export async function GET(req: Request, context: { params: Promise<{ symbol: string }> }) {
  try {
    const { symbol } = await context.params; // ✅ unwrap the params
    const data = await fetchAsset(symbol);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Error fetching asset:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
