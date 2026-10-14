"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function VerificationDecisionButton({ targetUserId, currentStatus }: { targetUserId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);

  const handleDecision = async (action: "VERIFY" | "REJECT") => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, action }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Action failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus !== "VERIFIED" && (
        <button
          onClick={() => handleDecision("VERIFY")}
          disabled={loading}
          className="px-2 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded hover:bg-emerald-200 transition-colors"
        >
          Approve KYC
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button
          onClick={() => handleDecision("REJECT")}
          disabled={loading}
          className="px-2 py-1 text-[11px] font-semibold bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
        >
          Reject
        </button>
      )}
    </div>
  );
}
