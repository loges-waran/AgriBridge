import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkles, ArrowRight, Sprout, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getProjectCardImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function GlobalMatchingPage() {
  const projects = await prisma.farmProject.findMany({
    include: {
      farmer: true,
      farm: true,
      resourceGaps: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcf0e2] text-[#1e4731] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#24593c]" />
            <span>Resource Gap Matching Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Select a Farm Project to Run Matching
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            The AgriBridge Matching Engine resolves declared resource gaps against registered local workers, equipment owners, suppliers, buyers, and transporters.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/planting-seedlings.jpg"
            alt="Resource Gap Matching Engine in Tamil Nadu agriculture"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Cross-Resource Farming Synergy</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Discover proximity-ranked labour gangs, 4WD tractors, drone sprayers, certified seeds, and buyers for your cultivation cycle.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {projects.map((p) => {
            const openGaps = p.resourceGaps.filter((g) => g.status === "OPEN");
            const cropImg = getProjectCardImage(p.cropName, p.id);
            return (
              <div
                key={p.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Crop Photo Header */}
                <div className="relative h-36 overflow-hidden bg-stone-100">
                  <img
                    src={cropImg.src}
                    alt={cropImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <Badge variant={openGaps.length > 0 ? "urgent" : "verified"}>
                      {openGaps.length} Open Gaps
                    </Badge>
                    <span className="text-xs text-white font-semibold bg-black/40 px-2 py-0.5 rounded">
                      {p.season} Season
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 mb-1">{p.title}</h3>
                    <p className="text-xs text-stone-500 mb-3">
                      Farmer: {p.farmer.fullName.split("[")[0]} • {p.farm?.district || p.farmer.district}
                    </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {openGaps.map((g) => (
                      <span
                        key={g.id}
                        className="text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded"
                      >
                        {g.category}
                      </span>
                    ))}
                  </div>
                </div>

                  <div className="pt-3 border-t border-stone-100">
                    <Link
                      href={`/projects/${p.id}/matches`}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
                    >
                      <span>Compute Matches</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
