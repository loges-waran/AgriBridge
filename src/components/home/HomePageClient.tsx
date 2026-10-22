"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { QuickDemoLogin } from "@/components/auth/QuickDemoLogin";
import { Badge } from "@/components/ui/Badge";
import { getProjectCardImage } from "@/lib/imageMap";
import { useI18n } from "@/lib/i18n/context";

interface SerializedProject {
  id: string;
  title: string;
  description: string | null;
  cropName: string;
  variety: string | null;
  season: string;
  acresAllotted: number;
  farmer: {
    fullName: string;
    district: string | null;
  };
  farm: {
    district: string;
  } | null;
  resourceGaps: { id: string }[];
}

interface HomePageClientProps {
  totalProjects: number;
  totalGaps: number;
  totalWorkers: number;
  totalMachinery: number;
  totalProducts: number;
  totalProduce: number;
  activeProjects: SerializedProject[];
}

export function HomePageClient({
  totalProjects,
  totalGaps,
  totalWorkers,
  totalMachinery,
  totalProducts,
  totalProduce,
  activeProjects,
}: HomePageClientProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION WITH AUTHENTIC TAMIL NADU AGRICULTURAL PHOTOGRAPHY BACKGROUND */}
      <section className="relative border-b border-stone-200 py-12 md:py-20 overflow-hidden">
        {/* Authentic Tamil Nadu paddy landscape with soft overlay for high text contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/tamilnadu-farmland-hero.jpg"
            alt="Authentic Tamil Nadu agricultural landscape after monsoon rain"
            className="w-full h-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/90 to-white/75 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-emerald-950/5" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Hero Text and Actions */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcf0e2] text-[#1e4731] text-xs font-semibold mb-6 border border-[#bbe0c7]">
                <Sprout className="w-4 h-4 text-[#24593c]" />
                <span>{t.tagline} ({t.subtagline})</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
                {t.hero_headline} <br />
                <span className="text-[#24593c]">{t.hero_headline_highlight}</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
                {t.hero_sub}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#24593c] text-white font-medium text-sm hover:bg-[#1e4731] transition-all shadow-sm"
                >
                  <span>{t.start_project}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects/matches"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white border border-stone-300 text-stone-700 font-medium text-sm hover:bg-stone-50 transition-colors shadow-2xs"
                >
                  <span>{t.view_gap_engine}</span>
                </Link>
              </div>

              {/* Quick Demo Persona Bar */}
              <div className="mt-8 p-4 bg-white rounded-lg border border-stone-200 shadow-2xs max-w-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {t.quick_demo_login}
                  </span>
                  <span className="text-[11px] text-stone-500">{t.one_click_login}</span>
                </div>
                <QuickDemoLogin />
              </div>
            </div>

            {/* Right Column: Agricultural Visual Collage */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative">
                {/* Main Featured Photo */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] border-4 border-white">
                  <img
                    src="/images/agribridge/01-farm-projects/green-paddy-field.jpg"
                    alt="Vibrant green paddy fields in Tamil Nadu Cauvery delta"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-5">
                    <div>
                      <span className="bg-[#24593c] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Kuruvai &amp; Samba Season
                      </span>
                      <p className="text-white text-sm font-bold mt-1">
                        Delta &amp; Dryland Coordinated Cultivation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overlapping Floating Thumbnail Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white p-2 rounded-xl shadow-lg border border-stone-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img
                      src="/images/machinery/tractor.jpg"
                      alt="Tractor rentals"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pr-2">
                    <p className="text-xs font-bold text-stone-900">{t.marketplaces_menu.machinery}</p>
                    <p className="text-[10px] text-stone-500">Tractors &amp; Drone Sprayers</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg border border-stone-200 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <img
                      src="/images/crops/turmeric.jpg"
                      alt="Turmeric crop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pr-1 text-right">
                    <p className="text-[11px] font-bold text-[#24593c]">{t.marketplaces_menu.produce}</p>
                    <p className="text-[10px] text-stone-500">Direct Mandi • Zero Middlemen</p>
                  </div>
                </div>
              </div>
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
              <p className="text-xs text-stone-500 font-medium mt-0.5">{t.active_projects}</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-amber-600">{totalGaps}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{t.open_resource_gaps}</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-stone-800">{totalWorkers}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{t.labour_gangs}</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-stone-800">{totalMachinery}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{t.machinery_units}</p>
            </div>
            <div className="p-3 border-r border-stone-100 last:border-none">
              <p className="text-2xl font-bold text-stone-800">{totalProducts}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{t.marketplaces_menu.inputs}</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-stone-800">{totalProduce}</p>
              <p className="text-xs text-stone-500 font-medium mt-0.5">{t.marketplaces_menu.produce}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE AGRICULTURAL SCENARIOS WITH IMAGES */}
      <section className="py-16 bg-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              {t.scenarios_heading}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              {t.scenarios_subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scenario A */}
            <div className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors">
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src="/images/agribridge/02-funding-and-investment/farmer-funding-growth.jpg"
                  alt="Co-farming investment and working capital growth"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{t.scenario_a_badge}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {t.scenario_a_title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t.scenario_a_desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href="/marketplaces/investment"
                    className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                  >
                    <span>{t.scenario_a_action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scenario B */}
            <div className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors">
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src="/images/agribridge/01-farm-projects/rice-field-workers.jpg"
                  alt="Farm labour gang crew transplanting crops"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{t.scenario_b_badge}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {t.scenario_b_title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t.scenario_b_desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href="/marketplaces/labour"
                    className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                  >
                    <span>{t.scenario_b_action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scenario C */}
            <div className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors">
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src="/images/resources/produce.jpg"
                  alt="Koyambedu wholesale agricultural mandi and produce trade in Tamil Nadu"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{t.scenario_c_badge}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {t.scenario_c_title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t.scenario_c_desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href="/marketplaces/produce"
                    className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                  >
                    <span>{t.scenario_c_action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scenario D */}
            <div className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors">
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src="/images/machinery/tractor.jpg"
                  alt="Farm machinery rentals"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{t.scenario_d_badge}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {t.scenario_d_title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t.scenario_d_desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href="/marketplaces/machinery"
                    className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                  >
                    <span>{t.scenario_d_action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scenario E */}
            <div className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors">
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src="/images/resources/fertilizer.jpg"
                  alt="Certified seeds and inputs"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{t.scenario_e_badge}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {t.scenario_e_title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t.scenario_e_desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href="/marketplaces/inputs"
                    className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                  >
                    <span>{t.scenario_e_action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Scenario F */}
            <div className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors">
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src="/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg"
                  alt="Rural freight and mandi haulage in Tamil Nadu"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{t.scenario_f_badge}</span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 mb-1">
                    {t.scenario_f_title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t.scenario_f_desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <Link
                    href="/marketplaces/transport"
                    className="text-xs font-semibold text-[#24593c] flex items-center gap-1 hover:underline"
                  >
                    <span>{t.scenario_f_action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVE FARM PROJECTS WITH CROP IMAGES */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                {t.active_projects} &amp; Matching Opportunities
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Real farm projects actively resolving missing resource requirements in Tamil Nadu.
              </p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24593c] hover:underline"
            >
              <span>{t.common.view_all}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeProjects.map((p) => {
              const cropImg = getProjectCardImage(p.cropName, p.id);
              return (
                <div
                  key={p.id}
                  className="agri-card flex flex-col justify-between overflow-hidden hover:border-[#24593c] transition-colors"
                >
                  <div className="relative h-36 overflow-hidden bg-stone-100">
                    <img
                      src={cropImg.src}
                      alt={cropImg.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                      <Badge variant="open">{p.season} Season</Badge>
                      <span className="text-xs text-white font-semibold bg-black/40 px-2 py-0.5 rounded">
                        {p.acresAllotted} {t.common.acres}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-bold text-stone-900 mb-1">
                        {p.title}
                      </h3>
                      <p className="text-xs text-stone-600 mb-3 line-clamp-2">
                        {p.description || "Active cultivation project seeking resource partners."}
                      </p>

                      <div className="p-3 bg-stone-50 rounded-md border border-stone-200 space-y-1.5 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span className="text-stone-500">{t.common.crop}:</span>
                          <span className="font-semibold text-stone-800">{p.cropName} ({p.variety || 'Standard'})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">{t.common.district}:</span>
                          <span className="font-semibold text-stone-800">{p.farm?.district || p.farmer.district}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">{t.common.open_gaps}:</span>
                          <span className="font-semibold text-amber-700">{p.resourceGaps.length} Requirements</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500">
                        {t.common.farmer}: {p.farmer.fullName.split("[")[0]}
                      </span>
                      <Link
                        href={`/projects/${p.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#24593c] hover:underline"
                      >
                        <span>{t.common.details}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
