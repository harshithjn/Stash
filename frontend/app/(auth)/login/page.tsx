"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Logo = () => (
  <img
    src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
    alt="Bitcoin Logo"
    className="w-8 h-8"
  />
);

const GitHubIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loadingGitHub, setLoadingGitHub] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDemoLogin = async () => {
    try {
      setLoadingDemo(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: process.env.NEXT_PUBLIC_DEMO_EMAIL || "demo@stash.app",
        password: process.env.NEXT_PUBLIC_DEMO_PASSWORD || "demo123456",
      });

      if (error) {
        console.error("Demo login error:", error.message);
        setError(error.message);
        setLoadingDemo(false);
        return;
      }

      if (data?.session) {
        // Redirect to user-specific dashboard
        const userId = data.user?.id;
        if (userId) {
          window.location.href = `/dashboard/${userId}`;
        }
      }
    } catch (err: any) {
      console.error("Unexpected demo login error:", err.message);
      setError(err.message);
      setLoadingDemo(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      setLoadingGitHub(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        console.error("GitHub login error:", error.message);
        setError(error.message);
        setLoadingGitHub(false);
      }
    } catch (err: any) {
      console.error("Unexpected login error:", err.message);
      setError(err.message);
      setLoadingGitHub(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <Logo />
        <h2 className="mt-4 text-2xl font-semibold text-white">
          Sign in to Stash
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Access your digital portfolio securely.
        </p>

        {/* GitHub Sign In */}
        <button
          onClick={handleGitHubSignIn}
          disabled={loadingGitHub || loadingDemo}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 p-3 text-base font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GitHubIcon />
          {loadingGitHub ? "Redirecting..." : "Sign in with GitHub"}
        </button>

        {/* Demo Login */}
        <button
          onClick={handleDemoLogin}
          disabled={loadingGitHub || loadingDemo}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-lg border border-blue-700 bg-blue-900 p-3 text-base font-medium text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingDemo ? "Signing in..." : "Demo Login (Quick Access)"}
        </button>

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

        <p className="mt-8 text-center text-sm text-zinc-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
