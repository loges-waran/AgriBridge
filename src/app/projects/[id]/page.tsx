import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  Sprout,
  Calendar,
  Layers,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

export const dynamic = "force-dynamic";

export default async function ProjectWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  const project = await prisma.farmProject.findUnique({
    where: { id },
    include: {
      farmer: true,
      farm: true,
      resourceGaps: true,
      milestones: { orderBy: { targetDate: "asc" } },
      budgetEntries: true,
      expenses: { include: { payer: true } },
      investmentProposals: true,
      produceListings: true,
      agreements: true,
    },
  });

  if (!project) notFound();

  const totalSpent = project.expenses.reduce((acc, e) => acc + e.amount, 0);
  const openGaps = project.resourceGaps.filter((g) => g.status === "OPEN");

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">{project.title}</h1>
              <Badge variant={project.status === "READY_TO_START" ? "verified" : "open"}>
                {project.status}
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Farmer: {project.farmer.fullName.split("[")[0]} • Location:{" "}
              {project.farm?.locationName || project.farmer.district} ({project.acresAllotted} Acres {project.cropName})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/projects/${project.id}/matches`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-amber-700 text-white font-medium text-xs hover:bg-amber-800 transition-colors shadow-2xs"
            >
              <span>Run Resource Gap Matching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Project Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard
            label="Estimated Budget"
            value={`₹${(project.estimatedBudget || 145000).toLocaleString()}`}
            subtext="Baseline Plan"
            icon={Coins}
          />
          <StatCard
            label="Actual Recorded Expenses"
            value={`₹${totalSpent.toLocaleString()}`}
            subtext={`${project.expenses.length} Incurred Items`}
            icon={Coins}
          />
          <StatCard
            label="Projected Revenue"
            value={`₹${(project.projectedRevenue || 375000).toLocaleString()}`}
            subtext={`Target: ${project.targetYieldKg || 12000} kg`}
            icon={Sprout}
          />
          <StatCard
            label="Open Resource Gaps"
            value={openGaps.length}
            subtext={openGaps.length === 0 ? "Fully Provisioned" : "Requires Fulfillment"}
            icon={Clock}
            trendPositive={openGaps.length === 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 cols): Milestones & Resource Gaps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resource Gaps Status */}
            <div className="agri-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Project Resource Requirements</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Coordinated resource dependencies for this cultivation project
                  </p>
                </div>
                <Link
                  href={`/projects/${project.id}/matches`}
                  className="text-xs font-semibold text-amber-800 hover:underline"
                >
                  Match All ({openGaps.length} Open) →
                </Link>
              </div>

              <div className="space-y-3">
                {project.resourceGaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-stone-900">{gap.title}</span>
                        <Badge variant={gap.status === "OPEN" ? "urgent" : "verified"}>
                          {gap.status}
                        </Badge>
                      </div>
                      <p className="text-stone-500 text-[11px]">
                        Category: <strong>{gap.category}</strong> • Quantity:{" "}
                        <strong>{gap.quantityNeeded ? `${gap.quantityNeeded} ${gap.unit || ''}` : "Standard Requirement"}</strong>
                      </p>
                      {gap.notes && (
                        <p className="text-stone-600 text-[11px] mt-1 bg-white p-1.5 rounded border border-stone-100">
                          {gap.notes}
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.id}/matches`}
                      className="inline-flex items-center gap-1 font-semibold text-[#24593c] hover:underline shrink-0"
                    >
                      <span>Find Partner</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultivation Timeline & Milestones */}
            <div className="agri-card p-5">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-4 flex items-center justify-between">
                <span>Agronomic Cultivation Timeline</span>
                <span className="text-xs text-stone-500">
                  {project.milestones.length} Key Milestones
                </span>
              </h3>

              <div className="space-y-4">
                {project.milestones.map((m, idx) => (
                  <div key={m.id} className="flex items-start gap-3 text-xs">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#24593c] flex items-center justify-center font-bold text-[11px]">
                        {idx + 1}
                      </div>
                      {idx !== project.milestones.length - 1 && (
                        <div className="w-0.5 h-8 bg-stone-200 my-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-stone-900">{m.title}</h4>
                        <span className="text-stone-400 text-[11px]">
                          Target: {new Date(m.targetDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-1">
                        <Badge variant={m.status === "COMPLETED" ? "verified" : "neutral"}>
                          {m.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Financials & Field Data */}
          <div className="space-y-6">
            {/* Plot Specifications */}
            <div className="agri-card p-5 text-xs">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3">
                Farm Parcel Specifications
              </h3>
              <div className="space-y-2 text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-400">Total Project Area:</span>
                  <strong className="text-stone-900">{project.acresAllotted} Acres</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Soil Type:</span>
                  <strong className="text-stone-900">{project.farm?.soilType || "Clay Loam"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Water Irrigation:</span>
                  <strong className="text-stone-900">{project.farm?.waterSource || "Borewell + Canal"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Power Source:</span>
                  <strong className="text-stone-900">{project.farm?.powerSource || "3-Phase Grid"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Organic Farming:</span>
                  <strong className="text-emerald-800">{project.farm?.isOrganic ? "Certified Organic" : "Conventional / Transitional"}</strong>
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="agri-card p-5 text-xs">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3">
                Estimated Budget Allocations
              </h3>
              <div className="space-y-2">
                {project.budgetEntries.length === 0 ? (
                  <p className="text-stone-400 italic">Default standard budget applied.</p>
                ) : (
                  project.budgetEntries.map((b) => (
                    <div key={b.id} className="flex justify-between items-center text-stone-600">
                      <span>{b.category}</span>
                      <strong className="text-stone-900">₹{b.estimatedCost.toLocaleString()}</strong>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Financial Ledger */}
            <div className="agri-card p-5 text-xs">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3">
                Recorded Actual Expenses
              </h3>
              {project.expenses.length === 0 ? (
                <p className="text-stone-400 italic">No expense entries recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {project.expenses.map((e) => (
                    <div key={e.id} className="p-2 bg-stone-50 rounded border border-stone-100 flex justify-between">
                      <div>
                        <div className="font-semibold text-stone-900">{e.description}</div>
                        <div className="text-[11px] text-stone-400">{e.category}</div>
                      </div>
                      <strong className="text-stone-900">₹{e.amount}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
