import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive,
}: StatCardProps) {
  return (
    <div className="agri-card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">{label}</p>
        <div className="p-2 rounded-md bg-[#f0f7f2] text-[#24593c]">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2">
        <h4 className="text-2xl font-bold text-stone-900">{value}</h4>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && (
              <span
                className={`font-semibold ${
                  trendPositive ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {trend}
              </span>
            )}
            {subtext && <span className="text-stone-500">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
