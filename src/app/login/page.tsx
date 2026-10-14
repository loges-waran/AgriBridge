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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      await refreshUser();

      // Route to role-specific dashboard
      const role = data.user?.activeRole || "FARMER";
      const target = `/dashboard/${role.toLowerCase()}`;
      router.push(target);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
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
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
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

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
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
