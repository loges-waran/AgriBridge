import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Sprout, Plus, Search, ArrowRight, Layers, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Farm Projects & Cultivation Ventures
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

        {/* Filter Bar */}
        <div className="my-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
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
            return (
              <div
                key={p.id}
                className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={p.status === "READY_TO_START" ? "verified" : "open"}>
                      {p.status}
                    </Badge>
                    <span className="text-xs text-stone-500 font-semibold">
                      {p.acresAllotted} Acres
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-1">{p.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2 mb-3">
                    {p.description || "Active cultivation project."}
                  </p>

                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5 text-xs text-stone-600 mb-3">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Crop & Variety:</span>
                      <strong className="text-stone-900">{p.cropName} ({p.variety || 'Local'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Season & Duration:</span>
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
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
