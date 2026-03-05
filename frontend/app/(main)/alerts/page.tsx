"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Edit2, X } from "lucide-react";

interface Alert {
  id: string;
  user_id: string;
  coin_symbol: string;
  coin_name: string;
  condition: "above" | "below";
  target_price: number;
  current_price?: number;
  is_active: boolean;
  created_at: string;
}

export default function AlertsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState({
    coin_symbol: "",
    coin_name: "",
    condition: "above" as "above" | "below",
    target_price: "",
  });

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(checkAlerts, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const activeAlerts = alerts.filter(a => a.is_active);
    
    for (const alert of activeAlerts) {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${alert.coin_symbol}&vs_currencies=usd`
        );
        const data = await res.json();
        const currentPrice = data[alert.coin_symbol]?.usd;

        if (currentPrice) {
          const triggered =
            (alert.condition === "above" && currentPrice >= alert.target_price) ||
            (alert.condition === "below" && currentPrice <= alert.target_price);

          if (triggered) {
            await supabase.from("notifications").insert({
              user_id: user.id,
              message: `${alert.coin_name} (${alert.coin_symbol.toUpperCase()}) is now ${alert.condition} $${alert.target_price}. Current price: $${currentPrice}`,
              type: "alert",
            });

            await supabase
              .from("alerts")
              .update({ is_active: false })
              .eq("id", alert.id);

            fetchAlerts();
          }
        }
      } catch (err) {
        console.error("Error checking alert:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (editingAlert) {
        const { error } = await supabase
          .from("alerts")
          .update({
            coin_symbol: formData.coin_symbol.toLowerCase(),
            coin_name: formData.coin_name,
            condition: formData.condition,
            target_price: parseFloat(formData.target_price),
          })
          .eq("id", editingAlert.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("alerts").insert({
          user_id: user.id,
          coin_symbol: formData.coin_symbol.toLowerCase(),
          coin_name: formData.coin_name,
          condition: formData.condition,
          target_price: parseFloat(formData.target_price),
          is_active: true,
        });

        if (error) throw error;
      }

      setShowModal(false);
      setEditingAlert(null);
      setFormData({ coin_symbol: "", coin_name: "", condition: "above", target_price: "" });
      fetchAlerts();
    } catch (err) {
      console.error("Error saving alert:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (error) throw error;
      fetchAlerts();
    } catch (err) {
      console.error("Error deleting alert:", err);
    }
  };

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setFormData({
      coin_symbol: alert.coin_symbol,
      coin_name: alert.coin_name,
      condition: alert.condition,
      target_price: alert.target_price.toString(),
    });
    setShowModal(true);
  };

  const toggleActive = async (alert: Alert) => {
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ is_active: !alert.is_active })
        .eq("id", alert.id);

      if (error) throw error;
      fetchAlerts();
    } catch (err) {
      console.error("Error toggling alert:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Price Alerts</h1>
            <p className="text-gray-400">Get notified when your crypto reaches target prices</p>
          </div>
          <button
            onClick={() => {
              setEditingAlert(null);
              setFormData({ coin_symbol: "", coin_name: "", condition: "above", target_price: "" });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Create Alert
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="bg-[#111] border border-gray-800 rounded-xl p-12 text-center">
            <Bell size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No alerts yet</h3>
            <p className="text-gray-400 mb-6">Create your first price alert to get notified</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg transition-colors"
            >
              Create Alert
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-[#111] border rounded-xl p-6 transition-all ${
                  alert.is_active
                    ? "border-purple-500/30 hover:border-purple-500/50"
                    : "border-gray-800 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      alert.condition === "above" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}>
                      {alert.condition === "above" ? (
                        <TrendingUp size={20} className="text-green-500" />
                      ) : (
                        <TrendingDown size={20} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{alert.coin_name}</h3>
                      <p className="text-xs text-gray-500 uppercase">{alert.coin_symbol}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActive(alert)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      alert.is_active
                        ? "bg-green-500/10 text-green-500"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {alert.is_active ? "Active" : "Inactive"}
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-1">Target Price</p>
                  <p className="text-2xl font-bold">${alert.target_price.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Alert when price goes {alert.condition} target
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(alert)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-sm transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-gray-800 rounded-xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingAlert ? "Edit Alert" : "Create New Alert"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingAlert(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Coin Symbol (e.g., bitcoin, ethereum)
                  </label>
                  <input
                    type="text"
                    value={formData.coin_symbol}
                    onChange={(e) => setFormData({ ...formData, coin_symbol: e.target.value })}
                    placeholder="bitcoin"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Coin Name
                  </label>
                  <input
                    type="text"
                    value={formData.coin_name}
                    onChange={(e) => setFormData({ ...formData, coin_name: e.target.value })}
                    placeholder="Bitcoin"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Condition
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value as "above" | "below" })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="above">Price goes above</option>
                    <option value="below">Price goes below</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Target Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.target_price}
                    onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                    placeholder="50000"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAlert(null);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg transition-colors"
                  >
                    {editingAlert ? "Update" : "Create"} Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
