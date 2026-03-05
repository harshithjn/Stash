import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/supabaseServer";

// GET /api/dashboard
export async function GET() {
  try {
    // Get all user portfolios
    const { data: portfolios, error } = await supabaseServer
      .from("portfolios")
      .select("user_id, total_value_usd, roi_percentage, updated_at");

    if (error) throw error;

    const totalUsers = portfolios?.length || 0;
    const totalValue = portfolios?.reduce((acc, p) => acc + (p.total_value_usd || 0), 0);
    const avgROI =
      totalUsers === 0
        ? 0
        : portfolios.reduce((acc, p) => acc + (p.roi_percentage || 0), 0) / totalUsers;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalValue,
        avgROI: Number(avgROI.toFixed(2)),
      },
      portfolios,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
