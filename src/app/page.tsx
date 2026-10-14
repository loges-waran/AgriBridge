import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Sprout,
  Users,
  Coins,
  Wrench,
  Package,
  ShoppingBag,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { QuickDemoLogin } from "@/components/auth/QuickDemoLogin";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Real database metrics (no fabricated numbers)
  const [
    totalProjects,
    totalGaps,
    totalWorkers,
    totalMachinery,
    totalProducts,
    totalProduce,
  ] = await Promise.all([
    prisma.farmProject.count(),
    prisma.resourceGap.count({ where: { status: "OPEN" } }),
    prisma.labourProfile.count(),
    prisma.machinery.count(),
    prisma.inputProduct.count(),
    prisma.produceListing.count(),
  ]);

  const activeProjects = await prisma.farmProject.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      farmer: true,
      farm: true,
      resourceGaps: true,
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#f0f7f2] via-[#faf9f5] to-[#fbfbfa] border-b border-stone-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcf0e2] text-[#1e4731] text-xs font-semibold mb-6 border border-[#bbe0c7]">
              <Sprout className="w-4 h-4 text-[#24593c]" />
              <span>Unified Agriculture Collaboration & Resource Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Connect every agricultural resource. <br />
              <span className="text-[#24593c]">Bridge every farming gap.</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed">
              AgriBridge connects farmers with the land, capital, skilled labour, machinery, certified inputs, buyers, and transport needed to execute complete farming projects — from nursery preparation to mandi settlement.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#24593c] text-white font-medium text-sm hover:bg-[#1e4731] transition-all shadow-sm"
              >
                <span>Create Farm Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects/matches"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors shadow-2xs"
              >
                <span>View Resource Gap Engine</span>
              </Link>
            </div>

            {/* Quick Demo Persona Bar */}
            <div className="mt-10 p-4 bg-white rounded-lg border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Instant Evaluator Access: Test All 9 Stakeholder Dashboards
                </span>
                <span className="text-[11px] text-stone-500">1-Click Login (Demo Accounts)</span>
              </div>
              <QuickDemoLogin />
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL PLATFORM METRICS */}
      <section className="bg-white border-b border-stone-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-[#24593c]">{totalProjects}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Active Projects</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-amber-600">{totalGaps}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Open Resource Gaps</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-stone-800">{totalWorkers}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Labour Gangs</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-stone-800">{totalMachinery}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Machinery Units</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-stone-800">{totalProducts}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Certified Inputs</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-stone-800">{totalProduce}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">Produce Harvests</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE AGRICULTURAL SCENARIOS */}
      <section className="py-16 bg-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Built for Real Indian Farming Challenges
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Every farmer has a different combination of assets. AgriBridge supplies the exact missing pieces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scenario A */}
            <div className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Scenario A: Land & Knowledge, No Investment
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Have fertile land and agronomic expertise but lack working capital? Register your land and crop plan to connect with verified angel investors for transparent profit-sharing without debt traps.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/marketplaces/investment"
                  className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                >
                  <span>Explore Agri-Investments</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scenario B */}
            <div className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-100 text-[#24593c] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Scenario B: Land & Money, No Farm Labour
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Need skilled workers for transplanting, weeding, or harvesting? Post requirements with transparent daily wages, food/transport terms, and book verified agricultural worker gangs.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/marketplaces/labour"
                  className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                >
                  <span>Discover Labour Gangs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scenario C */}
            <div className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-stone-100 text-stone-700 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Scenario C: Harvest Ready, No Fair Market Access
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Sell at transparent prices directly to wholesale mandi aggregators, processors, and bulk retailers. Agree on advance pre-harvest forward contracts with clear net proceeds.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/marketplaces/produce"
                  className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                >
                  <span>View Produce Listings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scenario D */}
            <div className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Scenario D: Missing Modern Equipment
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Book 4WD tractors with rotavators, laser levelers, and 16L agriculture drone sprayers on hourly or per-acre rates with verified local operators and conflict-free calendars.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/marketplaces/machinery"
                  className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                >
                  <span>Browse Machinery Rentals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scenario E */}
            <div className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-green-100 text-green-800 flex items-center justify-center mb-4">
                  <Package className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Scenario E: Certified Seeds & Organic Inputs
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Access certified high-germination seed varieties (BPT 5204, CR 1009), bio-NPK composts, neem bio-repellents, and gravity drip irrigation units with local dealer dispatch.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/marketplaces/inputs"
                  className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                >
                  <span>Shop Agri-Inputs Store</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Scenario F */}
            <div className="agri-card p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-stone-900 mb-2">
                  Scenario F: Rural Freight & Mandi Transport
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Reliable haulage from farm gate to market. Hire 3.5-ton mini-trucks or 10-ton lorries with per-kilometer rates and verified delivery tracking.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/marketplaces/transport"
                  className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                >
                  <span>Book Agricultural Transport</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE FARM PROJECTS & RESOURCE GAPS PREVIEW */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                Live Farm Projects & Matching Opportunities
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Real farm projects actively resolving missing resource requirements in Tamil Nadu.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24593c] hover:underline"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeProjects.map((p) => (
              <div key={p.id} className="agri-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="open">{p.season} Season</Badge>
                    <span className="text-xs text-stone-500 font-medium">
                      {p.acresAllotted} Acres
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-600 mb-3 line-clamp-2">
                    {p.description || "Active cultivation project seeking resource partners."}
                  </p>

                  <div className="p-3 bg-stone-50 rounded-md border border-stone-200 space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Crop:</span>
                      <span className="font-semibold text-stone-800">{p.cropName} ({p.variety || 'Standard'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Location:</span>
                      <span className="font-semibold text-stone-800">{p.farm?.district || p.farmer.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Open Gaps:</span>
                      <span className="font-semibold text-amber-700">{p.resourceGaps.length} Requirements</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    Farmer: {p.farmer.fullName.split("[")[0]}
                  </span>
                  <Link
                    href={`/projects/${p.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    <span>Inspect Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
