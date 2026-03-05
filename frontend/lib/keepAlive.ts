import { createClient } from "./supabase/supabaseClient";

/**
 * Keep-alive function to prevent Supabase from going idle
 * Sends a lightweight query every 24 hours
 */
export const initializeKeepAlive = () => {
  const supabase = createClient();

  const keepAlive = async () => {
    try {
      // Simple query to keep connection alive
      await supabase.from("profiles").select("id").limit(1);
      console.log("Keep-alive ping sent:", new Date().toISOString());
    } catch (error) {
      console.error("Keep-alive error:", error);
    }
  };

  // Run immediately on initialization
  keepAlive();

  // Run every 24 hours (86400000 ms)
  const interval = setInterval(keepAlive, 24 * 60 * 60 * 1000);

  // Return cleanup function
  return () => clearInterval(interval);
};

/**
 * Alternative: More aggressive keep-alive (every 12 hours)
 */
export const initializeAggressiveKeepAlive = () => {
  const supabase = createClient();

  const keepAlive = async () => {
    try {
      // Ping multiple tables to ensure all connections stay active
      await Promise.all([
        supabase.from("profiles").select("id").limit(1),
        supabase.from("notifications").select("id").limit(1),
        supabase.from("portfolios").select("id").limit(1),
      ]);
      console.log("Aggressive keep-alive ping sent:", new Date().toISOString());
    } catch (error) {
      console.error("Aggressive keep-alive error:", error);
    }
  };

  // Run immediately
  keepAlive();

  // Run every 12 hours
  const interval = setInterval(keepAlive, 12 * 60 * 60 * 1000);

  return () => clearInterval(interval);
};
