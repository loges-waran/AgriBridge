"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export function DisputeResolutionButton({ complaintId }: { complaintId: string }) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    const resolution = prompt("Enter mediation / settlement resolution note:");
    if (!resolution) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "RESOLVE", complaintId, resolution }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to resolve dispute");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleResolve} loading={loading}>
      Resolve Ticket
    </Button>
  );
}
