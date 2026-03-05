"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";
import Link from "next/link";
import { Search, Star, TrendingUp, TrendingDown, X } from "lucide-react";

export default function WatchlistPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const userId = params.id as string;

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [allCoins, setAllCoins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.id !== userId) {
        router.push("/login");
        return;
      }

      await fetchWatchlist();
    };
    init();
  }, [userId]);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const { data: savedCoins, error: fetchError } = await supabase
        .from("watchlist")
        .select("symbol, name")
        .eq("user_id", userId);

      if (fetchError) throw fetchError;

      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      );
      const marketData = await res.json();
      setAllCoins(marketData);

      if (savedCoins?.length) {
        const merged = savedCoins.map((coin) => {
          const live = marketData.find(
            (m: any) => m.id.toLowerCase() === coin.symbol.toLowerCase()
          );
          return {
            ...coin,
            id: live?.id || coin.symbol,
            image: live?.image,
            current_price: live?.current_price,
            price_change_percentage_24h: live?.price_change_percentage_24h,
            market_cap: live?.market_cap,
          };
        });
        setWatchlist(merged);
      } else {
        setWatchlist([]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (coinId: string, name: string) => {
    const { error } = await supabase.from("watchlist").insert([
      {
        user_id: userId,
        symbol: coinId,
        name,
      },
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    const added = allCoins.find((c) => c.id === coinId);
    setWatchlist((prev) => [
      ...prev,
      {
        symbol: coinId,
        name,
        id: coinId,
        image: added?.image,
        current_price: added?.current_price,
        price_change_percentage_24h: added?.price_change_percentage_24h,
        market_cap: added?.market_cap,
      },
    ]);
    setSearch("");
  };

  const handleRemove = async (symbol: string) => {
    const { error } = await supabase
      .from("watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("symbol", symbol);

    if (error) {
      console.error(error);
      return;
    }

    setWatchlist((prev) => prev.filter((coin) => coin.symbol !== symbol));
  };

  const filteredCoins = allCoins.filter(
    (coin) =>
      (coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())) &&
      !watchlist.some((w) => w.symbol === coin.id)
  );

  const formatCurrency = (value: number) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (!value) return "N/A";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading watchlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => fetchWatchlist()}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My Watchlist</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track your favorite cryptocurrencies
          </p>
        </div>

        {/* Search/Add Section */}
        <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coins to add to watchlist..."
              className="w-full pl-12 pr-4 py-3 bg-[#0a0a0a] border border-gray-800 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {search && filteredCoins.length > 0 && (
            <div className="mt-4 bg-[#0a0a0a] border border-gray-800 rounded-lg max-h-60 overflow-y-auto">
              {filteredCoins.slice(0, 10).map((coin) => (
                <button
                  key={coin.id}
                  onClick={() => handleAdd(coin.id, coin.name)}
                  className="w-full flex items-center justify-between gap-3 p-4 hover:bg-gray-900 transition-colors text-left border-b border-gray-800 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                    </div>
                  </div>
                  <Star size={16} className="text-gray-500" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist Grid */}
        {watchlist.length === 0 ? (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-12 text-center">
            <Star size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-2">No coins in your watchlist yet</p>
            <p className="text-sm text-gray-500">
              Use the search box above to add your first coin!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {watchlist.map((coin) => (
              <div
                key={coin.symbol}
                className="bg-[#111] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image || "/placeholder.png"}
                      alt={coin.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{coin.name}</h3>
                      <p className="text-xs text-gray-500 uppercase">{coin.symbol}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(coin.symbol)}
                    className="p-1 hover:bg-red-600/10 rounded transition-colors"
                  >
                    <X size={16} className="text-gray-500 hover:text-red-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Current Price</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(coin.current_price)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">24h Change</p>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
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
                      {Math.abs(coin.price_change_percentage_24h || 0).toFixed(2)}%
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-1">Market Cap</p>
                    <p className="text-sm font-medium text-gray-300">
                      {formatLargeNumber(coin.market_cap)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/coins/${coin.id}`}
                  className="block mt-4 text-center text-sm text-blue-500 hover:text-blue-400 transition-colors"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
