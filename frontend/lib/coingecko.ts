export async function fetchMarketData() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false",
    { next: { revalidate: 60 } } // Cache for 60 seconds
  );
  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
}

export async function fetchAsset(symbol: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`
  );
  if (!res.ok) throw new Error("Failed to fetch asset details");
  return res.json();
}
