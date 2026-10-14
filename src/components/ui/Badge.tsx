import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "verified" | "pending" | "open" | "urgent" | "neutral" | "success" | "warning";
  size?: "sm" | "md";
}

export function Badge({ children, variant = "neutral", size = "sm" }: BadgeProps) {
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  const variantMap = {
    verified: "badge-verified font-medium",
    pending: "badge-pending font-medium",
    open: "badge-open font-medium",
    urgent: "badge-urgent font-medium",
    neutral: "bg-stone-100 text-stone-700 border border-stone-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses} ${variantMap[variant]}`}
    >
      {children}
    </span>
  );
}
