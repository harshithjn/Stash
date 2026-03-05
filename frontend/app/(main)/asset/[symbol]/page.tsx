"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AssetPage() {
  const params = useParams();
  const symbol = Array.isArray(params.symbol)
    ? params.symbol[0]
    : params.symbol ?? ""; // safe fallback

  const [asset, setAsset] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("7");

  useEffect(() => {
    if (!symbol) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/asset/${symbol}`);
        if (!res.ok) throw new Error("Failed to fetch asset data");
        const data = await res.json();
        setAsset(data);

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}/market_chart?vs_currency=usd&days=${range}`
        );
        const chartJson = await chartRes.json();

        const formatted = chartJson.prices.map(
          ([time, price]: [number, number]) => ({
            time: new Date(time).toLocaleDateString(),
            price: Number(price.toFixed(2)),
          })
        );

        setChartData(formatted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [symbol, range]);
  if (loading) return <div className="p-6 text-white">Loading asset data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!asset) return <div className="p-6 text-gray-400">No asset data found.</div>;
  return (
    <div className="p-6 text-white space-y-8">
      {/* Top Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0b0b0b] border border-gray-800 p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <img
            src={asset.image?.small || "/placeholder.png"}
            alt={asset.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-semibold">{asset.name}</h1>
            <p className="text-gray-400 uppercase">{asset.symbol}</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0 text-right">
          <p className="text-4xl font-bold">
            ${asset.market_data.current_price.usd.toLocaleString()}
          </p>
          <p
            className={`text-sm font-medium ${
              asset.market_data.price_change_percentage_24h > 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {asset.market_data.price_change_percentage_24h.toFixed(2)}% (24h)
          </p>
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">Market Cap</p>
          <p className="text-lg font-semibold">
            ${asset.market_data.market_cap.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">24h Volume</p>
          <p className="text-lg font-semibold">
            ${asset.market_data.total_volume.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">Circulating Supply</p>
          <p className="text-lg font-semibold">
            {asset.market_data.circulating_supply.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">All-Time High</p>
          <p className="text-lg font-semibold">
            ${asset.market_data.ath.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">All-Time Low</p>
          <p className="text-lg font-semibold">
            ${asset.market_data.atl.usd.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#0b0b0b] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">Rank</p>
          <p className="text-lg font-semibold">#{asset.market_cap_rank}</p>
        </div>
      </div>

      {/* Interactive Chart */}
      <div className="bg-[#0b0b0b] border border-gray-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Price Chart (USD)</h2>
          <div className="flex gap-2">
            {["7", "30", "90", "365"].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  range === r
                    ? "bg-white text-black"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {r}D
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis stroke="#666" domain={["dataMin", "dataMax"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
                borderRadius: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#00FF88"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Description */}
      <div className="bg-[#0b0b0b] border border-gray-800 p-6 rounded-2xl">
        <h3 className="text-lg font-semibold mb-3">About {asset.name}</h3>
        <p className="text-gray-400 leading-relaxed">
          {asset.description.en
            ? asset.description.en.slice(0, 400) + "..."
            : "No description available."}
        </p>
      </div>
    </div>
  );
}
