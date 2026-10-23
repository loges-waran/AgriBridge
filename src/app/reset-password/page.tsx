"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Sprout, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const qToken = searchParams.get("token");
    if (qToken) setToken(qToken);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccessMsg("Password successfully reset! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Set New Password</h1>
          <p className="text-xs text-stone-500 mt-1">
            Choose a strong, secure password for your AgriBridge account
          </p>
        </div>

        <div className="agri-card p-6 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Reset Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md font-mono focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                placeholder="Paste token or follow link"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                New Password (min 8 characters)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Update Password
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            <Link href="/login" className="font-semibold text-[#24593c] hover:underline">
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-stone-500">Loading password reset...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
