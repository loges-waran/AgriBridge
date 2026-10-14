import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sparkles, ArrowRight, Sprout, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {projects.map((p) => {
            const openGaps = p.resourceGaps.filter((g) => g.status === "OPEN");
            return (
              <div
                key={p.id}
                className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={openGaps.length > 0 ? "urgent" : "verified"}>
                      {openGaps.length} Open Gaps
                    </Badge>
                    <span className="text-xs text-stone-500 font-semibold">{p.season} Season</span>
                  </div>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
