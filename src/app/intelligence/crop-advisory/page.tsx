import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkles, Sprout, Droplets, Calendar, ShieldAlert, ArrowRight, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getCropImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function CropAdvisoryPage() {
  let intelList: any[] = [];
  try {
    intelList = await prisma.agriculturalIntelligence.findMany({
      orderBy: { cropName: "asc" },
    });
  } catch (error) {
    console.error("Crop advisory query error:", error);
  }

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agronomic Science &amp; Agro-Climatic Intelligence</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Crop Advisory &amp; Cultivation Intelligence
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

        {/* Hero section with crop illustration strip */}
        <div className="relative rounded-xl overflow-hidden mt-6 mb-8 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/parambu-field-preparation.jpg"
            alt="Agricultural worker using traditional Parambu to prepare wetland fields in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e4731]/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Season-Aware Crop Intelligence</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Water requirements, growth durations, yield estimates, and pest-risk guidance tailored for Tamil Nadu agro-climatic zones.
            </p>
          </div>
        </div>

        {/* Crop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {intelList.map((item) => {
            const cropImg = getCropImage(item.cropName);
            return (
              <div
                key={item.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Crop Image Header */}
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={cropImg.src}
                    alt={cropImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white drop-shadow">{item.cropName}</h3>
                    <Badge variant={item.waterRequirement === "High" ? "pending" : "verified"}>
                      {item.waterRequirement} Water
                    </Badge>
                  </div>
                </div>

                <div className="p-5">
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

                  {/* Irrigation & Growth stage visual indicator */}
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 p-2.5 rounded bg-blue-50 border border-blue-100 text-[11px] text-blue-900">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <strong>Irrigation</strong>
                      </div>
                      <span>{item.waterRequirement} requirement</span>
                    </div>
                    <div className="flex-1 p-2.5 rounded bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-900">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <strong>Duration</strong>
                      </div>
                      <span>{item.growthDurationDays} days to harvest</span>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-amber-50/50 border border-amber-100 text-xs text-amber-900 mb-4">
                    <strong className="block text-[11px] text-amber-800 mb-0.5 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Risks &amp; Agronomic Mitigation:
                    </strong>
                    <p className="text-[11px] leading-relaxed text-amber-800">{item.risksAndMitigation}</p>
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
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {intelList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-9 h-9 text-[#24593c]" />
            </div>
            <p className="text-stone-500 text-sm">No crop advisory data available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
