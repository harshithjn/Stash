"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, TrendingDown, Star } from "lucide-react";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  market_cap_rank: number;
}

export default function CoinsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rank" | "price" | "change">("rank");

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [search, sortBy, coins]);

  const fetchCoins = async () => {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false"
      );
      
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please refresh the page in a moment.");
        }
        throw new Error("Failed to fetch coins");
      }
      
      const data = await res.json();
      setCoins(data);
      setFilteredCoins(data);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching coins:", err);
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "price") {
      filtered.sort((a, b) => b.current_price - a.current_price);
    } else if (sortBy === "change") {
      filtered.sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
    } else {
      filtered.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
    }

    setFilteredCoins(filtered);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">All Cryptocurrencies</h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse and track {coins.length}+ cryptocurrencies
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coins..."
              className="w-full pl-12 pr-4 py-3 bg-[#111] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-[#111] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="rank">Sort by Rank</option>
            <option value="price">Sort by Price</option>
            <option value="change">Sort by 24h Change</option>
          </select>
        </div>

        {/* Coins Table */}
        {loading ? (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-8 text-center text-gray-500">
            Loading coins...
          </div>
        ) : (
          <div className="bg-[#111] border border-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a0a] border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Coin
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Market Cap
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Volume (24h)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredCoins.map((coin) => (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {coin.market_cap_rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/coins/${coin.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium group-hover:text-blue-400 transition-colors">
                              {coin.name}
                            </div>
                            <div className="text-xs text-gray-500 uppercase">
                              {coin.symbol}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div
                          className={`flex items-center justify-end gap-1 ${
                            coin.price_change_percentage_24h >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {coin.price_change_percentage_24h >= 0 ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                        {formatLargeNumber(coin.market_cap)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-400">
                        {formatLargeNumber(coin.total_volume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredCoins.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No coins found matching your search
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
