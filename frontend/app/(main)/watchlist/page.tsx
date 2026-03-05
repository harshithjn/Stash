"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function WatchlistPage() {
  const supabase = createClient();
  const router = useRouter();

  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [allCoins, setAllCoins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const ensureTableExists = async () => {
    try {
      const { error } = await supabase.rpc("ensure_watchlist_table");
      if (error) console.warn("Skipping RPC setup, using direct SQL fallback.");
    } catch {
      console.log("Ensuring table via fallback SQL…");

      await supabase.rpc("drop_watchlist_if_exists");

      await supabase.from("watchlist").select("*").limit(1);
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);

      await ensureTableExists();
      await fetchWatchlist(user.id);
    };
    init();
  }, [supabase, router]);

  const fetchWatchlist = async (uid: string) => {
    setLoading(true);
    try {
      const { data: savedCoins, error: fetchError } = await supabase
        .from("watchlist")
        .select("symbol, name")
        .eq("user_id", uid);

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
            image: live?.image,
            current_price: live?.current_price,
            price_change_percentage_24h: live?.price_change_percentage_24h,
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

  const handleAdd = async (symbol: string, name: string) => {
    if (!userId) return;

    const { error } = await supabase.from("watchlist").insert([
      {
        user_id: userId,
        symbol,
        name,
      },
    ]);

    if (error) {
      setError(error.message);
      return;
    }

    const added = allCoins.find(
      (c) => c.id.toLowerCase() === symbol.toLowerCase()
    );

    setWatchlist((prev) => [
      ...prev,
      {
        symbol,
        name,
        image: added?.image,
        current_price: added?.current_price,
        price_change_percentage_24h: added?.price_change_percentage_24h,
      },
    ]);
  };

  const handleRemove = async (symbol: string) => {
    if (!userId) return;

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

  const filteredCoins = allCoins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        Loading your watchlist...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

        {/* Search/Add Section */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coins to add..."
            className="w-full md:w-1/2 p-3 rounded-lg bg-[#0b0b0b] border border-gray-800 focus:ring-1 focus:ring-gray-600 outline-none text-white"
          />
          {search && (
            <div className="bg-[#0b0b0b] border border-gray-800 mt-2 rounded-lg max-h-60 overflow-y-auto">
              {filteredCoins.length > 0 ? (
                filteredCoins.slice(0, 10).map((coin, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      handleAdd(coin.id, coin.name);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-900 transition text-left"
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>{coin.name}</span>
                    <span className="text-gray-400 text-sm uppercase">
                      {coin.symbol}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 p-3">No results found</p>
              )}
            </div>
          )}
        </div>

        {/* Display Watchlist */}
        {watchlist.length === 0 ? (
          <div className="text-gray-500 text-center">
            No coins in your watchlist yet.
            <p className="text-sm text-gray-400 mt-2">
              Use the search box above to add your first coin!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {watchlist.map((coin, i) => (
              <div
                key={i}
                className="bg-[#0b0b0b] border border-gray-800 p-5 rounded-xl hover:bg-gray-900 transition flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={coin.image || "/placeholder.png"}
                    alt={coin.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{coin.name}</h2>
                    <p className="text-gray-400 text-sm uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-400">Current Price</p>
                  <p className="text-xl font-semibold">
                    ${coin.current_price?.toLocaleString()}
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-400">24h Change</p>
                  <p
                    className={`text-lg font-medium ${
                      coin.price_change_percentage_24h >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <a
                    href={`/asset/${coin.symbol}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    View Details →
                  </a>
                  <button
                    onClick={() => handleRemove(coin.symbol)}
                    className="text-sm text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
