import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkles, Sprout, Droplets, Calendar, ShieldAlert, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function CropAdvisoryPage() {
  const intelList = await prisma.agriculturalIntelligence.findMany({
    orderBy: { cropName: "asc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agronomic Science & Agro-Climatic Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Crop Advisory & Cultivation Intelligence
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified crop suitability metrics, Tamil Nadu seasonal calendars (Kuruvai, Samba, Navarai), and disease bio-defense
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/intelligence/budget-calculator"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
            >
              <span>Budget Calculator →</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {intelList.map((item) => (
            <div
              key={item.id}
              className="agri-card p-6 flex flex-col justify-between hover:border-[#24593c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-stone-900">{item.cropName}</h3>
                  <Badge variant={item.waterRequirement === "High" ? "pending" : "verified"}>
                    {item.waterRequirement} Water
                  </Badge>
                </div>

                <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-2 text-xs text-stone-600 mb-4">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Recommended Soil:</span>
                    <strong className="text-stone-900">{item.recommendedSoil}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Tamil Nadu Seasons:</span>
                    <strong className="text-stone-900">{item.seasonTamilNadu}</strong>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-200">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Growth Days</span>
                      <strong className="text-stone-900">{item.growthDurationDays} Days</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Avg Yield / Acre</span>
                      <strong className="text-stone-900">{item.avgYieldPerAcreKg.toLocaleString()} kg</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Base Mandi Rate</span>
                      <strong className="text-[#24593c]">₹{item.baseSellingPricePerKg}/kg</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-amber-50/50 border border-amber-100 text-xs text-amber-900 mb-4">
                  <strong className="block text-[11px] text-amber-800 mb-0.5">
                    Risks & Agronomic Mitigation:
                  </strong>
                  <p className="text-[11px] leading-relaxed text-amber-800">{item.risksAndMitigation}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">
                  Average Cost: ₹{item.avgCostPerAcreInr.toLocaleString()}/acre
                </span>
                <Link
                  href="/projects/new"
                  className="font-semibold text-[#24593c] hover:underline"
                >
                  Create Project with this Crop →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
