"use client";

import { useState } from "react";
import { createClient } from "../../../lib/supabase/supabaseClient";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage("Password reset email sent. Check your inbox!");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-[#0b0b0b] border border-gray-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-2 text-center">Reset Password</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter your email address to receive a reset link.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg bg-black border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full p-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            {status === "loading" ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              status === "error" ? "text-red-400" : "text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-center mt-6 text-gray-400 text-sm">
          <a href="/login" className="hover:underline">Back to login</a>
        </div>
      </div>
    </div>
  );
}
