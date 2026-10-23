import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Coins, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getCropImage, FUNDING_AND_INVESTMENT_IMAGES } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function InvestmentMarketplacePage() {
  let proposals: any[] = [];
  try {
    proposals = await prisma.investmentProposal.findMany({
      where: { status: "ACTIVE" },
      include: {
        project: {
          include: { farmer: true, farm: true, milestones: true },
        },
        eoiList: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Investment proposals query error:", error);
  }

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-1 border border-amber-200">
            <Coins className="w-3.5 h-3.5" />
            <span>Co-Farming &amp; Working Capital Co-Investment</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Agricultural Investment &amp; Partnership Proposals
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent crop-cycle funding backed by verified farmland, milestones, and net harvest revenue sharing
          </p>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/02-funding-and-investment/green-investment-growth.jpg"
            alt="Green investment and sustainable agricultural returns in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/85 via-stone-900/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Milestone-Backed Cultivation Capital</p>
            <p className="text-amber-100 text-xs mt-1 max-w-sm">
              Direct bilateral agreements with verified cultivators, milestone-based releases, and transparent harvest ledger auditing.
            </p>
          </div>
        </div>

        {/* Regulatory Risk Notice */}
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
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
          {proposals.map((prop, idx) => {
            const isOrganicOrCarbon = prop.project.title.toLowerCase().includes("organic") || prop.project.description?.toLowerCase().includes("carbon");
            const headerImg = isOrganicOrCarbon
              ? FUNDING_AND_INVESTMENT_IMAGES.sustainableInvestmentGrowth
              : idx % 2 === 0
              ? FUNDING_AND_INVESTMENT_IMAGES.farmerFundingGrowth
              : FUNDING_AND_INVESTMENT_IMAGES.greenInvestmentGrowth;
            return (
              <div
                key={prop.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Funding Photo Header */}
                <div className="relative h-36 overflow-hidden bg-stone-100">
                  <img
                    src={headerImg.src}
                    alt={headerImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <Badge variant="verified">
                      {prop.partnershipType === "PROFIT_SHARE"
                        ? `${prop.profitSharePercent}% Net Revenue Share`
                        : prop.partnershipType}
                    </Badge>
                    <span className="text-xs text-white font-semibold bg-black/40 px-2 py-0.5 rounded">
                      {prop.cultivationMonths} Months Cycle
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
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

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> KYC &amp; Land Patta Verified
                    </span>
                    <Link
                      href={`/projects/${prop.project.id}`}
                      className="font-semibold text-[#24593c] hover:underline"
                    >
                      Review Proposal &amp; Plan →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {proposals.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Coins className="w-9 h-9 text-amber-700" />
            </div>
            <p className="text-stone-500 text-sm">No investment proposals currently active.</p>
          </div>
        )}
      </div>
    </div>
  );
}
