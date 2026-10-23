"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sprout, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setSuccessMsg(data.message || "Password reset instructions generated.");
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
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
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Reset Password</h1>
          <p className="text-xs text-stone-500 mt-1">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {resetUrl && (
          <div className="agri-card p-3 mb-4 bg-emerald-50 border-emerald-300 text-xs text-emerald-800">
            <p className="font-semibold mb-1">🔗 Direct Password Reset Link (Development Mode):</p>
            <Link
              href={resetUrl}
              className="text-[#24593c] font-bold underline break-all hover:text-[#183d29]"
            >
              Click here to set your new password
            </Link>
          </div>
        )}

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
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                placeholder="farmer@agribridge.org"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Send Password Reset Link
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-[#24593c] hover:underline">
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
