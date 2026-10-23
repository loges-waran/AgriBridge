"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sprout, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuickDemoLogin } from "@/components/auth/QuickDemoLogin";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUnverifiedEmail(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.requiresVerification) {
          setUnverifiedEmail(data.email || email);
        }
        throw new Error(data.error || "Login failed");
      }

      await refreshUser();

      // Route to role-specific dashboard
      const role = data.user?.activeRole || "FARMER";
      const target = `/dashboard/${role.toLowerCase()}`;
      window.location.href = target;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = async () => {
    try {
      const res = await fetch("/api/auth/oauth/google");
      const data = await res.json();
      if (data.configured && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert("Google OAuth: " + (data.message || "Not configured. Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable."));
      }
    } catch {
      alert("Failed to initiate OAuth flow");
    }
  };

  return (
    <div className="py-12 md:py-20 flex items-center justify-center px-4 bg-[#fbfbfa]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#24593c] text-white mb-3 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Sign in to AgriBridge</h1>
          <p className="text-xs text-stone-500 mt-1">
            Access your agricultural projects, bookings, and marketplace activity
          </p>
        </div>

        {/* 1-Click Quick Demo Login Box */}
        <div className="agri-card p-4 mb-6 bg-stone-50/80 border-stone-200">
          <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            🚀 1-Click Instant Evaluator Access
          </p>
          <p className="text-[11px] text-stone-500 mb-2">
            Click any demo stakeholder persona to log in instantly:
          </p>
          <QuickDemoLogin />
        </div>

        <div className="agri-card p-6 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex flex-col gap-2 text-xs text-red-700">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              {unverifiedEmail && (
                <div className="pt-2 border-t border-red-200">
                  <Link
                    href={`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                    className="inline-flex items-center gap-1 font-bold text-[#24593c] underline hover:text-[#183d29]"
                  >
                    Click here to enter your 6-digit email verification code &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                  placeholder="farmer@agribridge.org"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#24593c] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleOAuthClick}
              className="w-full py-2 px-3 border border-stone-300 rounded-md text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="mt-5 text-center text-xs text-stone-600">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-semibold text-[#24593c] hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
