"use client";

import { useEffect, useState } from "react";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export default function MarketPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Coin[]>([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        const data = await res.json();
        setCoins(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching market data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  useEffect(() => {
    const results = coins.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, coins]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold">Market Prices</h1>

          <input
            type="text"
            placeholder="Search crypto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 sm:mt-0 w-full sm:w-64 p-3 bg-black border border-gray-800 rounded-xl text-gray-300 focus:ring-2 focus:ring-gray-600 outline-none"
          />
        </div>

        {loading ? (
          <div className="text-gray-500 text-center mt-20">Fetching live prices...</div>
        ) : (
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6 overflow-x-auto opacity-0 animate-fadeIn">
            <table className="w-full text-left text-gray-300">
              <thead className="text-gray-500 text-sm border-b border-gray-800">
                <tr>
                  <th className="py-3">#</th>
                  <th className="py-3">Name</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">% 24h</th>
                  <th className="py-3">Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((coin, i) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-900 hover:bg-gray-900 transition"
                  >
                    <td className="py-3 text-gray-500">{i + 1}</td>
                    <td className="py-3 flex items-center gap-3 font-semibold">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-6 h-6 rounded-full"
                      />
                      {coin.name}
                      <span className="text-gray-500 text-sm uppercase ml-1">
                        {coin.symbol}
                      </span>
                    </td>
                    <td className="py-3">${coin.current_price.toLocaleString()}</td>
                    <td
                      className={`py-3 ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="py-3">
                      ${coin.market_cap.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
