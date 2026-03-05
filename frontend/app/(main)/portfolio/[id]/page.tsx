"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/supabaseClient";
import {
  PlusCircle,
  RefreshCcw,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
} from "lucide-react";

type Holding = {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avg_price: number;
  current_price?: number;
  total_value?: number;
  profit_loss?: number;
};

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const supabase = createClient();

  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editHolding, setEditHolding] = useState<Holding | null>(null);
  const [newHolding, setNewHolding] = useState({
    symbol: "",
    name: "",
    quantity: "",
    avg_price: "",
  });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch holdings
  useEffect(() => {
    if (!userId) return;
    fetchHoldings();
  }, [userId]);

  const fetchHoldings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching holdings:", error.message || error);
      setLoading(false);
      return;
    }

    const updated = await fetchLivePrices(data || []);
    setHoldings(updated);
    setLoading(false);
  };

  const fetchLivePrices = async (holdingsData: Holding[]) => {
    if (!holdingsData.length) return holdingsData;

    const ids = holdingsData.map((h) => h.symbol).join(",");
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      const data = await res.json();
      return holdingsData.map((h) => ({
        ...h,
        current_price: data[h.symbol]?.usd || 0,
        total_value: (data[h.symbol]?.usd || 0) * h.quantity,
        profit_loss:
          ((data[h.symbol]?.usd || 0) - h.avg_price) * h.quantity,
      }));
    } catch (err) {
      console.error("Price fetch failed:", err);
      return holdingsData;
    }
  };

  const addHolding = async () => {
    const { error } = await supabase.from("holdings").insert({
      user_id: userId,
      symbol: newHolding.symbol.toLowerCase(),
      name: newHolding.name,
      quantity: parseFloat(newHolding.quantity),
      avg_price: parseFloat(newHolding.avg_price),
    });
    if (error) console.error("Add error:", error);
    setShowModal(false);
    resetForm();
    fetchHoldings();
  };

  const updateHolding = async () => {
    if (!editHolding) return;
    const { error } = await supabase
      .from("holdings")
      .update({
        quantity: editHolding.quantity,
        avg_price: editHolding.avg_price,
      })
      .eq("id", editHolding.id);
    if (error) console.error("Update error:", error);
    setShowModal(false);
    setEditHolding(null);
    fetchHoldings();
  };

  const deleteHolding = async (id: string) => {
    const { error } = await supabase.from("holdings").delete().eq("id", id);
    if (error) console.error("Delete error:", error);
    fetchHoldings();
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchHoldings();
    setRefreshing(false);
  };

  const searchCoin = async (query: string) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      );
      const data = await res.json();
      setSearchResults(data.coins || []);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const resetForm = () => {
    setNewHolding({ symbol: "", name: "", quantity: "", avg_price: "" });
    setSearch("");
    setSearchResults([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading portfolio...</p>
      </div>
    );
  }

  const totalValue = holdings.reduce((a, h) => a + (h.total_value || 0), 0);
  const totalCost = holdings.reduce(
    (a, h) => a + h.avg_price * h.quantity,
    0
  );
  const roi = totalCost === 0 ? 0 : ((totalValue - totalCost) / totalCost) * 100;

  const card =
    "bg-[#0b0b0b] border border-gray-800 p-5 rounded-2xl shadow-sm hover:border-gray-700 transition-all";

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">My Portfolio</h1>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`${card}`}>
            <h2 className="text-sm text-gray-400">Total Value</h2>
            <p className="text-2xl font-bold mt-2">${totalValue.toLocaleString()}</p>
          </div>
          <div className={`${card}`}>
            <h2 className="text-sm text-gray-400">Invested Amount</h2>
            <p className="text-2xl font-bold mt-2">${totalCost.toLocaleString()}</p>
          </div>
          <div className={`${card}`}>
            <h2 className="text-sm text-gray-400">ROI</h2>
            <p
              className={`text-2xl font-bold mt-2 flex items-center gap-2 ${
                roi >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {roi.toFixed(2)}%{" "}
              {roi >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
            </p>
          </div>
        </div>

        {/* Holdings Section */}
        <div className="flex justify-between items-center mt-10">
          <h2 className="text-xl font-semibold">Your Holdings</h2>

          <button
            onClick={() => {
              setEditHolding(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            <PlusCircle size={18} /> Add Coin
          </button>
        </div>

        {holdings.length === 0 ? (
          <p className="text-gray-500 mt-6">No holdings added yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {holdings.map((h) => (
              <div
                key={h.id}
                className={`${card} flex flex-col justify-between hover:scale-[1.02] transition-transform`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{h.name}</h3>
                    <p className="text-gray-400 text-sm uppercase">{h.symbol}</p>
                  </div>

                  <p className="text-gray-400 text-sm mt-1">
                    Quantity: {h.quantity}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Avg Price: ${h.avg_price.toLocaleString()}
                  </p>

                  <div className="mt-4 border-t border-gray-800 pt-4">
                    <p className="text-sm text-gray-400">
                      Current Price: ${h.current_price?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-gray-400">
                      Value: ${h.total_value?.toLocaleString() || 0}
                    </p>
                    <p
                      className={`text-sm font-semibold mt-1 ${
                        (h.profit_loss || 0) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      P/L: {(h.profit_loss || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setEditHolding(h);
                      setShowModal(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteHolding(h.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#0b0b0b] border border-gray-800 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editHolding ? "Edit Holding" : "Add New Coin"}
            </h2>

            {!editHolding && (
              <>
                <input
                  type="text"
                  placeholder="Search coin..."
                  value={search}
                  onChange={(e) => searchCoin(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white mb-4"
                />
                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto bg-black border border-gray-700 rounded-lg mb-4">
                    {searchResults.slice(0, 6).map((coin) => (
                      <div
                        key={coin.id}
                        onClick={() => {
                          setNewHolding({
                            ...newHolding,
                            symbol: coin.id,
                            name: coin.name,
                          });
                          setSearch("");
                          setSearchResults([]);
                        }}
                        className="p-2 hover:bg-white/10 cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={coin.thumb}
                          alt={coin.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>{coin.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            <input
              type="number"
              placeholder="Quantity"
              value={editHolding ? editHolding.quantity : newHolding.quantity}
              onChange={(e) =>
                editHolding
                  ? setEditHolding({
                      ...editHolding,
                      quantity: parseFloat(e.target.value),
                    })
                  : setNewHolding({
                      ...newHolding,
                      quantity: e.target.value,
                    })
              }
              className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white mb-4"
            />

            <input
              type="number"
              placeholder="Average Buy Price"
              value={editHolding ? editHolding.avg_price : newHolding.avg_price}
              onChange={(e) =>
                editHolding
                  ? setEditHolding({
                      ...editHolding,
                      avg_price: parseFloat(e.target.value),
                    })
                  : setNewHolding({
                      ...newHolding,
                      avg_price: e.target.value,
                    })
              }
              className="w-full p-3 rounded-lg bg-black border border-gray-700 text-white mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditHolding(null);
                }}
                className="px-4 py-2 bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={editHolding ? updateHolding : addHolding}
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg"
              >
                {editHolding ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
