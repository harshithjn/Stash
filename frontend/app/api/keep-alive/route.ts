import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// This API route can be called by external cron services like cron-job.org or Vercel Cron
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase credentials not configured" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform lightweight queries to keep database active
    const [profiles, notifications, portfolios] = await Promise.all([
      supabase.from("profiles").select("id").limit(1),
      supabase.from("notifications").select("id").limit(1),
      supabase.from("portfolios").select("id").limit(1),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Keep-alive ping successful",
      queries: {
        profiles: profiles.error ? "error" : "success",
        notifications: notifications.error ? "error" : "success",
        portfolios: portfolios.error ? "error" : "success",
      },
    });
  } catch (error) {
    console.error("Keep-alive error:", error);
    return NextResponse.json(
      { error: "Keep-alive failed", details: error },
      { status: 500 }
    );
  }
}

// Optional: POST method for manual triggers
export async function POST() {
  return GET();
}
