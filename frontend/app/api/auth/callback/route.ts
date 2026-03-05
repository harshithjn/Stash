import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const error_description = requestUrl.searchParams.get("error_description");

    if (error_description) {
      console.error("❌ OAuth error:", error_description);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error_description)}`);
    }

    if (!code) {
      console.error("❌ No code returned from OAuth");
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("❌ Supabase auth error:", error.message);
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }

    console.log("✅ OAuth success! User:", data.user?.email);
    
    // Redirect to user-specific dashboard
    const userId = data.user?.id;
    if (userId) {
      return NextResponse.redirect(`${requestUrl.origin}/dashboard/${userId}`);
    }
    
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_user_id`);
  } catch (err: any) {
    console.error("❌ OAuth callback exception:", err.message);
    return NextResponse.redirect(
      `${new URL(request.url).origin}/login?error=oauth_failed`
    );
  }
}
