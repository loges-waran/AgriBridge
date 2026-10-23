"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sprout, MailCheck, AlertCircle, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    const qEmail = searchParams.get("email");
    const qCode = searchParams.get("code");
    if (qEmail) setEmail(qEmail);
    if (qCode) {
      setCode(qCode);
      setDevCode(qCode);
    }
  }, [searchParams]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Email verification failed");
      }

      setSuccessMsg("Email successfully verified! Redirecting to your dashboard...");
      await refreshUser();

      const activeRole = data.user?.activeRole || "FARMER";
      setTimeout(() => {
        window.location.href = `/dashboard/${activeRole.toLowerCase()}`;
      }, 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    setError(null);
    setResending(true);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setSuccessMsg("A fresh 6-digit verification code has been dispatched!");
      if (data.previewCode) {
        setDevCode(data.previewCode);
        setCode(data.previewCode);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="py-12 md:py-20 flex items-center justify-center px-4 bg-[#fbfbfa]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#24593c] text-white mb-3 shadow-xs">
            <MailCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Verify Your Email</h1>
          <p className="text-xs text-stone-500 mt-1">
            Enter the 6-digit verification code to activate your AgriBridge account
          </p>
        </div>

        {devCode && (
          <div className="agri-card p-3 mb-4 bg-emerald-50 border-emerald-300 text-xs text-emerald-800 flex items-center justify-between">
            <div>
              <span className="font-bold">🔑 Verification Code: </span>
              <span className="font-mono text-sm tracking-wider font-extrabold">{devCode}</span>
            </div>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-semibold">
              Ready
            </span>
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

          <form onSubmit={handleVerify} className="space-y-4">
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
                placeholder="name@domain.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2.5 text-center text-lg font-mono tracking-widest font-bold border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                placeholder="000000"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Verify Account Access
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-[#24593c] font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
              Resend Code
            </button>

            <Link href="/login" className="text-stone-500 hover:text-stone-800">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-stone-500">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
