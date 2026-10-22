import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Users, Sprout, ShoppingBag, AlertTriangle, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.activeRole !== "ADMIN") {
    redirect("/login");
  }

  const [
    totalUsers,
    totalProjects,
    totalProduceListings,
    pendingVerifications,
    openComplaints,
    auditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.farmProject.count(),
    prisma.produceListing.count(),
    prisma.user.findMany({
      where: { kycStatus: "PENDING" },
      take: 5,
    }),
    prisma.complaint.findMany({
      where: { status: "OPEN" },
      include: { user: true },
      take: 5,
    }),
    prisma.adminAuditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { admin: true },
    }),
  ]);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                AgriBridge Platform Governance Center
              </h1>
              <Badge variant="verified">Root Administrator</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              KYC Verifications • Dispute Resolution • Audit Trail & Platform Compliance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/verifications"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
            >
              <span>Manage KYC Queue</span>
            </Link>
            <Link
              href="/admin/disputes"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-stone-300 bg-white text-stone-700 font-medium text-xs hover:bg-stone-50"
            >
              <span>Dispute Mediation</span>
            </Link>
          </div>
        </div>

        {/* Agricultural Hero Section for Admin Center */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-40 sm:h-48">
          <img
            src="/images/agribridge/01-farm-projects/traditional-farming-silhouette.jpg"
            alt="AgriBridge ecosystem governance and rural platform management"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                AgriBridge Ecosystem Governance
              </h2>
              <p className="text-xs text-stone-200 mt-1 max-w-xl">
                Real-time oversight across Tamil Nadu agriculture clusters: KYC compliance, transparent dispute adjudication, and marketplace audit logs.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard
            label="Total Platform Users"
            value={totalUsers}
            subtext="9 Stakeholder Personas"
            icon={Users}
          />
          <StatCard
            label="Active Farm Projects"
            value={totalProjects}
            subtext="Across Tamil Nadu"
            icon={Sprout}
          />
          <StatCard
            label="Pending KYC Reviews"
            value={pendingVerifications.length}
            subtext="Aadhaar / Land Patta"
            icon={ShieldAlert}
            trendPositive={pendingVerifications.length === 0}
          />
          <StatCard
            label="Open Disputes"
            value={openComplaints.length}
            subtext="Requires Mediation"
            icon={AlertTriangle}
            trendPositive={openComplaints.length === 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* KYC Verification Queue */}
          <div className="agri-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-sm font-bold text-stone-900">
                Pending Stakeholder KYC Verifications
              </h3>
              <Link
                href="/admin/verifications"
                className="text-xs font-semibold text-[#24593c] hover:underline"
              >
                View All
              </Link>
            </div>

            {pendingVerifications.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-500 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                <span>All submitted KYC documents have been reviewed and verified.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingVerifications.map((u) => (
                  <div
                    key={u.id}
                    className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{u.fullName}</div>
                      <div className="text-stone-500 mt-0.5">
                        {u.email} • District: {u.district}
                      </div>
                    </div>
                    <Badge variant="pending">Awaiting Review</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grievance & Dispute Queue */}
          <div className="agri-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="text-sm font-bold text-stone-900">
                Open Grievances & Transaction Disputes
              </h3>
              <Link
                href="/admin/disputes"
                className="text-xs font-semibold text-[#24593c] hover:underline"
              >
                Review Tickets
              </Link>
            </div>

            {openComplaints.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-500 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                <span>No active disputes or unresolved grievances on the platform.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {openComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-900">{c.subject}</div>
                      <div className="text-stone-500 mt-0.5">
                        By {c.user.fullName.split("[")[0]} • Category: {c.category}
                      </div>
                    </div>
                    <Badge variant="urgent">Open</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
