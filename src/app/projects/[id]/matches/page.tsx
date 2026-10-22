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
import { getMachineryImage, getInputImage, getCropImage, RESOURCE_IMAGES } from "@/lib/imageMap";

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

  const cropImg = getCropImage(project.cropName);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Visual Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-36 sm:h-44">
          <img
            src={cropImg.src}
            alt={cropImg.alt}
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Resource Gap Matching Engine Active</span>
                  </span>
                  <span className="text-xs text-emerald-200">• Project #{project.id.slice(-6)}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                  Fulfill Resources: {project.title}
                </h1>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Proximity-matched verified partners within service radius of {project.farm?.district || project.farmer.district} ({project.cropName})
                </p>
              </div>

              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/30 bg-white/10 text-white font-medium text-xs hover:bg-white/20 shrink-0 backdrop-blur-sm"
              >
                <span>← Back to Workspace</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-8">
          {/* 1. LABOUR MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-200 shrink-0 bg-emerald-50">
                  <img
                    src={RESOURCE_IMAGES.labour.src}
                    alt="Agri labour gang"
                    className="w-full h-full object-cover"
                  />
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
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-100 border border-emerald-200 shrink-0">
                          <img
                            src={RESOURCE_IMAGES.labour.src}
                            alt="Labour gang"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-bold text-stone-900 text-sm">
                          {m.candidate.user.fullName.split("[")[0]} (Crew of {m.candidate.crewSize})
                        </span>
                      </div>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-blue-200 shrink-0 bg-blue-50">
                  <img
                    src={RESOURCE_IMAGES.machinery.src}
                    alt="Farm machinery fleet"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Machinery &amp; Equipment Matches ({machineryMatches.length} Units Available)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    4WD tractors with rotavators, puddlers, and drone sprayers within service radius
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machineryMatches.map((m: any) => {
                const machImg = getMachineryImage(m.candidate.category);
                return (
                  <div
                    key={m.candidate.id}
                    className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                            <img
                              src={machImg.src}
                              alt={machImg.alt}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-sm block">{m.candidate.name}</span>
                            <Badge variant="verified">{m.candidate.category}</Badge>
                          </div>
                        </div>
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
                );
              })}
            </div>
          </div>

          {/* 3. INPUT PRODUCT MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-teal-200 shrink-0 bg-teal-50">
                  <img
                    src={RESOURCE_IMAGES.seeds.src}
                    alt="Agri input supplies"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Certified Inputs &amp; Seeds ({inputMatches.length} Compatible Products)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Certified seed varieties and bio-fertilizers matching {project.cropName} requirements
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputMatches.map((m: any) => {
                const inImg = getInputImage(m.candidate.category);
                return (
                  <div
                    key={m.candidate.id}
                    className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 flex flex-col justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                            <img
                              src={inImg.src}
                              alt={inImg.alt}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-sm block">{m.candidate.name}</span>
                            <Badge variant={m.candidate.isOrganic ? "verified" : "neutral"}>
                              {m.candidate.isOrganic ? "Organic" : m.candidate.category}
                            </Badge>
                          </div>
                        </div>
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
                );
              })}
            </div>
          </div>

          {/* 4. BUYER MATCHES */}
          <div className="agri-card p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-purple-200 shrink-0 bg-purple-50">
                  <img
                    src={RESOURCE_IMAGES.buyer.src}
                    alt="Produce buyer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Produce Buyers &amp; Mandi Traders ({buyerMatches.length} Active Buyers)
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
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                          <img
                            src={cropImg.src}
                            alt="Produce trade"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">
                            {m.candidate.businessName}
                          </span>
                          <span className="text-[11px] text-stone-500">{m.candidate.buyerType}</span>
                        </div>
                      </div>
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
                      Connect &amp; Offer
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
