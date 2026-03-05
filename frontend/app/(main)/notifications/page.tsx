"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";

export default function NotificationsPage() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching notifications:", error);
      else setNotifications(data || []);
      setLoading(false);
    };

    fetchNotifications();

    // ✅ Real-time updates (new notifications instantly appear)
    const channel = supabase
      .channel("realtime-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-gray-400 flex items-center justify-center">
        Loading notifications...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">
            No notifications yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="bg-[#0b0b0b] border border-gray-800 p-5 rounded-2xl hover:border-gray-700 transition-all"
              >
                <h2 className="text-lg font-semibold text-white">
                  {n.title}
                </h2>
                <p className="text-gray-400 text-sm mt-1">{n.message}</p>
                <p className="text-xs text-gray-600 mt-2">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
