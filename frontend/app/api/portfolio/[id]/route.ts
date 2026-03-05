import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/supabaseClient";

// ✅ GET Portfolio by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the promise
  const supabase = createClient();

  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", id)
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// ✅ PUT (Update Portfolio)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const supabase = createClient();

  const { data, error } = await supabase
    .from("portfolios")
    .update({
      total_value_usd: body.total_value_usd,
      roi_percentage: body.roi_percentage,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", id)
    .select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// ✅ DELETE (Remove Portfolio)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = createClient();

  const { error } = await supabase.from("portfolios").delete().eq("user_id", id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
