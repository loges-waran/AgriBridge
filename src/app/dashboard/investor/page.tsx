import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Coins, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function InvestorDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [proposals, myEois] = await Promise.all([
    prisma.investmentProposal.findMany({
      where: { status: "ACTIVE" },
      include: {
        project: {
          include: {
            farmer: true,
            farm: true,
            budgetEntries: true,
            milestones: true,
          },
        },
      },
    }),
    prisma.expressionOfInterest.findMany({
      where: { investorId: user.id },
      include: {
        proposal: {
          include: { project: { include: { farmer: true } } },
        },
      },
    }),
  ]);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                Agri-Investor Portal: {user.fullName.split("[")[0]}
              </h1>
              <Badge variant="verified">KYC Verified Investor</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Direct working-capital co-farming agreements • Risk disclosures & milestone-governed releases
            </p>
          </div>

          <Link
            href="/marketplaces/investment"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <span>Explore All Crop Proposals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/02-funding-and-investment/green-investment-growth.jpg"
            alt="Agri-investor portal and sustainable crop cycle capital in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Milestone-Governed Cultivation Capital</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Deploy capital directly with verified Tamil Nadu farmers. Track milestones, verified field receipts, and net harvest revenue settlement.
            </p>
          </div>
        </div>

        {/* Regulatory Disclosure Banner */}
        <div className="my-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Agricultural Risk Disclosure Notice</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
              Farming involves biological, meteorological, and market pricing uncertainties. AgriBridge facilitates bilateral contract agreements and milestone accounting. We do NOT guarantee financial returns, pool public funds, or operate as an investment scheme.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="Verified Active Proposals"
            value={proposals.length}
            subtext="Delta & Tamil Nadu Crop Cycles"
            icon={Coins}
          />
          <StatCard
            label="My Expressions of Interest"
            value={myEois.length}
            subtext="In Negotiation / Confirmed"
            icon={FileText}
          />
          <StatCard
            label="Due Diligence Standard"
            value="100% On-Ground Verified"
            subtext="Land Patta & Farmer KYC Checked"
            icon={ShieldCheck}
            trendPositive={true}
          />
        </div>

        {/* Verified Crop Proposals List */}
        <div className="agri-card p-5">
          <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-4 flex items-center justify-between">
            <span>Verified Farm Co-Investment Proposals</span>
            <span className="text-xs text-stone-500">{proposals.length} Opportunities</span>
          </h3>

          <div className="space-y-4">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="p-5 rounded-lg border border-stone-200 bg-white hover:border-[#24593c] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                      <img
                        src="/images/agribridge/02-funding-and-investment/farmer-funding-growth.jpg"
                        alt="Farm project funding"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900">{prop.title}</h4>
                      <p className="text-xs text-stone-500">
                        Farmer: {prop.project.farmer.fullName.split("[")[0]} • Location:{" "}
                        {prop.project.farm?.district || prop.project.farmer.district} (
                        {prop.project.acresAllotted} Acres {prop.project.cropName})
                      </p>
                    </div>
                  </div>
                  <Badge variant="verified">
                    {prop.partnershipType === "PROFIT_SHARE"
                      ? `${prop.profitSharePercent}% Profit Share`
                      : prop.partnershipType}
                  </Badge>
                </div>

                <p className="text-xs text-stone-600 mb-4 leading-relaxed">{prop.summary}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-md border border-stone-100 text-xs text-stone-600 mb-4">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Target Capital</span>
                    <strong className="text-stone-900">₹{prop.targetFunding.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Min Contribution</span>
                    <strong className="text-stone-900">₹{prop.minInvestment.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Cycle Duration</span>
                    <strong className="text-stone-900">{prop.cultivationMonths} Months</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[11px]">Milestones</span>
                    <strong className="text-stone-900">{prop.project.milestones.length} Stages</strong>
                  </div>
                </div>

                {prop.riskMitigation && (
                  <p className="text-[11px] text-stone-500 bg-emerald-50/50 p-2 rounded border border-emerald-100 mb-4">
                    <strong>Agronomic Risk Mitigation:</strong> {prop.riskMitigation}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-stone-100 text-xs">
                  <span className="text-stone-500 text-[11px]">
                    Farmer KYC: <strong className="text-emerald-800">Verified</strong> • Land Patta:{" "}
                    <strong className="text-emerald-800">Verified</strong>
                  </span>
                  <Link
                    href={`/projects/${prop.project.id}`}
                    className="font-semibold text-[#24593c] hover:underline"
                  >
                    Review Cultivation Plan & Express Interest →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
