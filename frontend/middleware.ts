import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static files
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookies
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(cookie => 
    cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
  );

  const loggedIn = hasAuthCookie;

  // --- BLOCK PRIVATE ROUTES IF NOT LOGGED IN ---
  if (!loggedIn) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/portfolio") ||
      pathname.startsWith("/watchlist") ||
      pathname.startsWith("/alerts") ||
      pathname.startsWith("/notifications") ||
      pathname.startsWith("/market") ||
      pathname.startsWith("/asset") ||
      pathname.startsWith("/reports") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/analytics")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // --- PREVENT LOGGED-IN USERS FROM SEEING LOGIN/REGISTER ---
  if (loggedIn) {
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      // Redirect to home page instead of dashboard to avoid /dashboard without ID
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|auth).*)"],
};
