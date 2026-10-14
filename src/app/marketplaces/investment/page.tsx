import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Coins, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function InvestmentMarketplacePage() {
  const proposals = await prisma.investmentProposal.findMany({
    where: { status: "ACTIVE" },
    include: {
      project: {
        include: { farmer: true, farm: true, milestones: true },
      },
      eoiList: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-1 border border-amber-200">
            <Coins className="w-3.5 h-3.5" />
            <span>Co-Farming & Working Capital Co-Investment</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Agricultural Investment & Partnership Proposals
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent crop-cycle funding backed by verified farmland, milestones, and net harvest revenue sharing
          </p>
        </div>

        {/* Regulatory Risk Notice */}
        <div className="my-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Transparent Partnership Notice</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
              AgriBridge does not pool capital, offer securities, or guarantee financial returns. All proposals represent bilateral co-farming agreements between registered landowners/farmers and verified partners, with funds disbursed strictly against project milestones.
            </p>
          </div>
        </div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="agri-card p-6 flex flex-col justify-between hover:border-[#24593c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="verified">
                    {prop.partnershipType === "PROFIT_SHARE"
                      ? `${prop.profitSharePercent}% Net Revenue Share`
                      : prop.partnershipType}
                  </Badge>
                  <span className="text-xs text-stone-500 font-semibold">
                    {prop.cultivationMonths} Months Cycle
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 mb-1">{prop.title}</h3>
                <p className="text-xs text-stone-500 mb-3">
                  Farmer: {prop.project.farmer.fullName.split("[")[0]} • Location:{" "}
                  {prop.project.farm?.district || prop.project.farmer.district} ({prop.project.acresAllotted} Acres {prop.project.cropName})
                </p>

                <p className="text-xs text-stone-600 mb-4 leading-relaxed">{prop.summary}</p>

                <div className="grid grid-cols-3 gap-3 p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600 mb-4">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Target Capital</span>
                    <strong className="text-stone-900">₹{prop.targetFunding.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Min Ticket</span>
                    <strong className="text-stone-900">₹{prop.minInvestment.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Milestones</span>
                    <strong className="text-stone-900">{prop.project.milestones.length} Stages</strong>
                  </div>
                </div>

                {prop.riskMitigation && (
                  <p className="text-[11px] text-stone-600 bg-emerald-50/50 p-2.5 rounded border border-emerald-100 mb-4">
                    <strong>Risk Mitigation:</strong> {prop.riskMitigation}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> KYC & Land Patta Verified
                </span>
                <Link
                  href={`/projects/${prop.project.id}`}
                  className="font-semibold text-[#24593c] hover:underline"
                >
                  Review Proposal & Plan →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
