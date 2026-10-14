import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findMatchesForProject } from "@/lib/matching";
import {
  Users,
  Wrench,
  Package,
  ShoppingBag,
  Truck,
  Coins,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ProjectMatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let matchData: any;
  try {
    matchData = await findMatchesForProject(id);
  } catch {
    notFound();
  }

  const {
    project,
    labourMatches,
    machineryMatches,
    inputMatches,
    buyerMatches,
    transportMatches,
    investorMatches,
  } = matchData;

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Deterministic Matching Engine Active</span>
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-stone-500">
              Project #{project.id.slice(-6)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h1 className="text-2xl font-bold text-stone-900">
                Resource Gap Matches: {project.title}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Matching verified partners within service radius of {project.farm?.district || project.farmer.district}
              </p>
            </div>

            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-stone-300 bg-white text-stone-700 font-medium text-xs hover:bg-stone-50"
            >
              <span>Back to Project Workspace</span>
            </Link>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-8 mt-8">
          {/* 1. LABOUR MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-emerald-100 text-[#24593c] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Labour Gang Matches ({labourMatches.length} Eligible Crews)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Ranked by proximity to {project.farm?.district || "Delta"}, gang size, and crop experience
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labourMatches.map((m: any) => (
                <div
                  key={m.candidate.id}
                  className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {m.candidate.user.fullName.split("[")[0]} (Crew of {m.candidate.crewSize})
                      </span>
                      <span className="px-2 py-0.5 rounded font-bold text-emerald-800 bg-emerald-100 text-[11px]">
                        {m.score}% Match
                      </span>
                    </div>

                    <div className="text-stone-600 mb-2">
                      Wage Rate: <strong>₹{m.candidate.dailyWageRate}/worker/day</strong> • District:{" "}
                      <strong>{m.candidate.user.district}</strong>
                    </div>

                    <div className="space-y-1 mb-3">
                      {m.matchReasons.map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                      {m.caveats.map((c: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-amber-700 text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Skills: {m.candidate.skills.slice(0, 30)}...
                    </span>
                    <Link
                      href="/marketplaces/labour"
                      className="px-3 py-1 bg-[#24593c] text-white rounded font-medium text-[11px] hover:bg-[#1e4731]"
                    >
                      Book Gang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. MACHINERY MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Machinery & Equipment Matches ({machineryMatches.length} Units Available)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    4WD tractors with rotavators, puddlers, and drone sprayers within service radius
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machineryMatches.map((m: any) => (
                <div
                  key={m.candidate.id}
                  className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-900 text-sm">{m.candidate.name}</span>
                      <span className="px-2 py-0.5 rounded font-bold text-blue-800 bg-blue-100 text-[11px]">
                        {m.score}% Match
                      </span>
                    </div>

                    <div className="text-stone-600 mb-2">
                      Rental: <strong>₹{m.candidate.rentalRate}/{m.candidate.rateType.toLowerCase()}</strong> • Operator:{" "}
                      <strong>{m.candidate.providesOperator ? "Included" : "Self"}</strong>
                    </div>

                    <div className="space-y-1 mb-3">
                      {m.matchReasons.map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Owner: {m.candidate.owner.fullName.split("[")[0]} ({m.candidate.district})
                    </span>
                    <Link
                      href="/marketplaces/machinery"
                      className="px-3 py-1 bg-blue-800 text-white rounded font-medium text-[11px] hover:bg-blue-900"
                    >
                      Reserve Machine
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. INPUT PRODUCT MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Certified Inputs & Seeds ({inputMatches.length} Compatible Products)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Certified seed varieties and bio-fertilizers matching {project.cropName} requirements
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputMatches.map((m: any) => (
                <div
                  key={m.candidate.id}
                  className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-900 text-sm">{m.candidate.name}</span>
                      <span className="px-2 py-0.5 rounded font-bold text-teal-800 bg-teal-100 text-[11px]">
                        {m.score}% Match
                      </span>
                    </div>

                    <div className="text-stone-600 mb-2">
                      Price: <strong>₹{m.candidate.unitPrice}</strong> / {m.candidate.packageSize} • In Stock:{" "}
                      <strong>{m.candidate.stockQuantity}</strong>
                    </div>

                    <div className="space-y-1 mb-3">
                      {m.matchReasons.map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Supplier: {m.candidate.supplier.businessName}
                    </span>
                    <Link
                      href="/marketplaces/inputs"
                      className="px-3 py-1 bg-teal-800 text-white rounded font-medium text-[11px] hover:bg-teal-900"
                    >
                      Order Direct
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. BUYER MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-purple-100 text-purple-800 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Produce Buyers & Mandi Traders ({buyerMatches.length} Active Buyers)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Buyers actively purchasing {project.cropName} for pre-harvest forward contracts
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buyerMatches.map((m: any) => (
                <div
                  key={m.candidate.id}
                  className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 flex flex-col justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-stone-900 text-sm">
                        {m.candidate.businessName}
                      </span>
                      <span className="px-2 py-0.5 rounded font-bold text-purple-800 bg-purple-100 text-[11px]">
                        {m.score}% Match
                      </span>
                    </div>

                    <div className="text-stone-600 mb-2">
                      Trader Type: <strong>{m.candidate.buyerType}</strong> • District:{" "}
                      <strong>{m.candidate.district}</strong>
                    </div>

                    <div className="space-y-1 mb-3">
                      {m.matchReasons.map((r: string, i: number) => (
                        <div key={i} className="flex items-center gap-1.5 text-emerald-700 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Preferred: {m.candidate.preferredCrops}
                    </span>
                    <Link
                      href="/marketplaces/produce"
                      className="px-3 py-1 bg-purple-800 text-white rounded font-medium text-[11px] hover:bg-purple-900"
                    >
                      Connect & Offer
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
