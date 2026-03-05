"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/supabaseClient";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [allocData, setAllocData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("roi_history")
        .select("date, roi_percentage, asset_allocation")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching analytics:", error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setRoiData(
          data.map((d) => ({ date: d.date, roi: d.roi_percentage }))
        );

        const alloc = data[data.length - 1]?.asset_allocation || {};
        const formattedAlloc = Object.entries(alloc).map(([k, v]) => ({
          name: k,
          value: v,
        }));
        setAllocData(formattedAlloc);
      }

      setLoading(false);
    };

    fetchAnalytics();
  }, [supabase, router]);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6666"];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {loading ? (
          <div className="text-gray-500 text-center mt-20 animate-pulse">
            Loading analytics...
          </div>
        ) : !user ? (
          <div className="text-center text-gray-400 mt-10">
            Please log in to view analytics.
          </div>
        ) : (
          <div className="space-y-10">
            {/* ROI Chart */}
            <section className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">ROI Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={roiData}>
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #333",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#00C49F"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </section>

            {/* Asset Allocation */}
            <section className="bg-[#0b0b0b] border border-gray-800 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
              {allocData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allocData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {allocData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 text-center py-10">
                  No asset allocation data found.
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
