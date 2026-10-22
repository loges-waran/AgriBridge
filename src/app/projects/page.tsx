import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sprout, Plus, Search, ArrowRight, Layers, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { AgriImage } from "@/components/ui/AgriImage";
import { getCropImage, getProjectCardImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function ProjectsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; season?: string }>;
}) {
  const { crop, season } = await searchParams;

  const where: any = {};
  if (crop) where.cropName = { contains: crop };
  if (season) where.season = season;

  const projects = await prisma.farmProject.findMany({
    where,
    include: {
      farmer: true,
      farm: true,
      resourceGaps: true,
      milestones: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Farm Projects &amp; Cultivation Ventures
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Explore active farming ventures across Tamil Nadu or launch a new coordinated project
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731] transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Farm Project</span>
          </Link>
        </div>

        {/* Hero banner */}
        <div className="my-6 relative rounded-xl overflow-hidden h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/paddy-transplanting.jpg"
            alt="Paddy seedling transplanting in Tamil Nadu Cauvery delta"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24593c]/80 via-[#24593c]/40 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg drop-shadow">
              Coordinated Farm Projects
            </p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Paddy, turmeric, banana, organic cultivation — track resources, gaps, and revenue in one workspace.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Filter Season:</span>
            <Link
              href="/projects"
              className={`px-2.5 py-1 rounded border ${!season ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              All Seasons
            </Link>
            <Link
              href="/projects?season=Kuruvai"
              className={`px-2.5 py-1 rounded border ${season === "Kuruvai" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Kuruvai
            </Link>
            <Link
              href="/projects?season=Samba"
              className={`px-2.5 py-1 rounded border ${season === "Samba" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Samba
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Filter Crop:</span>
            <Link
              href="/projects?crop=Paddy"
              className={`px-2.5 py-1 rounded border ${crop === "Paddy" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Paddy
            </Link>
            <Link
              href="/projects?crop=Turmeric"
              className={`px-2.5 py-1 rounded border ${crop === "Turmeric" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Turmeric
            </Link>
            <Link
              href="/projects?crop=Banana"
              className={`px-2.5 py-1 rounded border ${crop === "Banana" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Banana
            </Link>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const openGaps = p.resourceGaps.filter((g) => g.status === "OPEN");
            const cropImg = getProjectCardImage(p.cropName, p.id);
            return (
              <div
                key={p.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Crop Image */}
                <div className="relative h-40 overflow-hidden bg-stone-100">
                  <img
                    src={cropImg.src}
                    alt={cropImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <Badge variant={p.status === "READY_TO_START" ? "verified" : "open"}>
                      {p.status}
                    </Badge>
                    <span className="text-xs text-white font-semibold bg-black/30 px-2 py-0.5 rounded">
                      {p.acresAllotted} Acres
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-stone-900 mb-1">{p.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                    {p.description || "Active cultivation project."}
                  </p>

                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5 text-xs text-stone-600 mb-3">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Crop &amp; Variety:</span>
                      <strong className="text-stone-900">{p.cropName} ({p.variety || 'Local'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Season &amp; Duration:</span>
                      <strong className="text-stone-900">{p.season} Season</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Location:</span>
                      <strong className="text-stone-900">{p.farm?.district || p.farmer.district}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Open Resource Gaps:</span>
                      <strong className="text-amber-800">{openGaps.length} Missing</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
                    <Link
                      href={`/projects/${p.id}/matches`}
                      className="font-semibold text-amber-800 hover:text-amber-900"
                    >
                      Match Resources →
                    </Link>
                    <Link
                      href={`/projects/${p.id}`}
                      className="font-semibold text-[#24593c] hover:underline"
                    >
                      View Workspace →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Sprout className="w-9 h-9 text-[#24593c]" />
            </div>
            <p className="text-stone-500 text-sm mb-3">No farm projects found for the current filter.</p>
            <Link
              href="/projects/new"
              className="inline-block px-4 py-2 bg-[#24593c] text-white rounded text-xs font-medium"
            >
              Create Your First Project
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
