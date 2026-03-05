"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FileDown, TrendingUp } from "lucide-react";

export default function ReportsPage() {
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const coinsList = [
    "bitcoin",
    "ethereum",
    "solana",
    "cardano",
    "dogecoin",
    "polkadot",
  ];

  // Fetch 30 days market data
  const fetchMarketData = async () => {
    if (selectedCoins.length === 0)
      return alert("Please select at least one coin.");
    setLoading(true);

    try {
      const responses = await Promise.all(
        selectedCoins.map((coin) =>
          fetch(
            `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=30`
          ).then((res) => res.json())
        )
      );

      const formatted = responses.map((res, index) => ({
        name: selectedCoins[index],
        data: res.prices.map(([timestamp, price]: [number, number]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price,
        })),
      }));

      setMarketData(formatted);
    } catch (error) {
      console.error("Error fetching market data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Stash - Market Report", 14, 15);

    const rows: any[] = [];
    marketData.forEach((coin) => {
      const latest = coin.data[coin.data.length - 1];
      const first = coin.data[0];
      const change = (
        ((latest.price - first.price) / first.price) *
        100
      ).toFixed(2);

      rows.push([
        coin.name.toUpperCase(),
        `$${latest.price.toFixed(2)}`,
        `${change}%`,
      ]);
    });

    doc.autoTable({
      head: [["Coin", "Latest Price", "30d Change"]],
      body: rows,
      startY: 25,
      styles: { fontSize: 10 },
    });

    doc.save("Stash_Report.pdf");
  };

  // Export CSV
  const exportCSV = () => {
    const header = ["Coin", "Date", "Price (USD)"];
    const rows = marketData.flatMap((coin) =>
      coin.data.map((d: any) => [coin.name, d.date, d.price.toFixed(2)])
    );
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stash_report.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <TrendingUp className="text-green-400" /> Reports & Analytics
        </h1>

        {/* Coin Selection */}
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">
            Select Coins to Compare:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {coinsList.map((coin) => (
              <button
                key={coin}
                onClick={() =>
                  setSelectedCoins((prev) =>
                    prev.includes(coin)
                      ? prev.filter((c) => c !== coin)
                      : [...prev, coin]
                  )
                }
                className={`p-2 rounded-lg border text-sm ${
                  selectedCoins.includes(coin)
                    ? "bg-green-500 text-black border-green-500"
                    : "border-gray-700 hover:bg-gray-900"
                }`}
              >
                {coin.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={fetchMarketData}
            disabled={loading}
            className="mt-4 px-6 py-2 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>

        {/* Chart Section */}
        {marketData.length > 0 && (
          <div className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6 mt-8 transition-opacity duration-300 opacity-100">
            <h2 className="text-xl font-semibold mb-4">
              30-Day Price Comparison
            </h2>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart>
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />

                  {marketData.map((coin, i) => (
                    <Line
                      key={i}
                      dataKey="price"
                      data={coin.data}
                      name={coin.name.toUpperCase()}
                      stroke={[
                        "#10b981",
                        "#3b82f6",
                        "#f59e0b",
                        "#ef4444",
                        "#8b5cf6",
                      ][i % 5]}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Export Buttons */}
        {marketData.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              <FileDown size={18} /> Export PDF
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-5 py-3 border border-gray-700 rounded-lg hover:bg-gray-900 transition"
            >
              <FileDown size={18} /> Export CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
