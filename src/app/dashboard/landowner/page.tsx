import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Layers, Plus, CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function LandownerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("LANDOWNER")) redirect("/dashboard");

  const [farms, landRecords] = await Promise.all([
    prisma.farm.findMany({
      where: { ownerId: user.id },
      include: { landRecords: true },
    }),
    prisma.landRecord.findMany({
      where: { ownerId: user.id },
      include: { farm: true },
    }),
  ]);

  const totalAcres = farms.reduce((acc, f) => acc + f.totalAcres, 0);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                Landowner Portal: {user.fullName.split("[")[0]}
              </h1>
              <Badge variant={user.kycStatus === "VERIFIED" ? "verified" : "pending"}>
                {user.kycStatus === "VERIFIED" ? "Verified Landowner" : "KYC Pending"}
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              District: {user.district || "Thanjavur"} • Patta / Chitta Verified Land Records
            </p>
          </div>

          <Link
            href="/marketplaces/land"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <Plus className="w-4 h-4" />
            <span>List Land for Lease / Sharecropping</span>
          </Link>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/traditional-ox-ploughing.jpg"
            alt="Traditional farming and arable land stewardship in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Farmland Ownership &amp; Stewardship</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Connect with verified cultivators, protect your Patta title rights, and track soil fertility milestones with transparent lease accounting.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
          <StatCard
            label="Total Acreage"
            value={`${totalAcres} Acres`}
            subtext={`${farms.length} Registered Farmlands`}
            icon={Layers}
          />
          <StatCard
            label="Lease Listings"
            value={landRecords.length}
            subtext="Available for Cultivators"
            icon={FileText}
          />
          <StatCard
            label="Verification Status"
            value={user.kycStatus === "VERIFIED" ? "Patta Verified" : "Verification Pending"}
            subtext="Revenue Department Alignment"
            icon={CheckCircle2}
            trendPositive={user.kycStatus === "VERIFIED"}
          />
        </div>

        <div className="agri-card p-5">
          <h3 className="text-sm font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100">
            My Registered Agricultural Parcels
          </h3>
          {landRecords.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/60">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#24593c] flex items-center justify-center mx-auto mb-2">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-stone-800">No Agricultural Parcels Registered</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                You have not registered any agricultural land records yet. Add a parcel with revenue survey numbers to connect with verified cultivators.
              </p>
              <Link
                href="/marketplaces/land"
                className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 bg-[#24593c] text-white rounded-lg text-xs font-bold hover:bg-[#1a402a] shadow-xs"
              >
                <span>Register Farmland Parcel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
            {landRecords.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-lg border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-stone-900 text-sm">
                    {r.farm?.name || "Cauvery Delta Farmland"} ({r.acresAvailable} Acres Available)
                  </div>
                  <div className="text-stone-500 mt-1">
                    Patta No: <strong>{r.titleNumber}</strong> • Lease Model: <strong>{r.leaseType}</strong>
                  </div>
                  <div className="text-stone-500 mt-0.5">
                    Expected Rent: ₹{r.expectedRentPerAcre?.toLocaleString()}/acre/year • Soil pH: {r.soilPh || "6.8"}
                  </div>
                  <p className="text-stone-600 mt-2 text-[11px] max-w-xl">{r.notes}</p>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <Badge variant="verified">Active Listing</Badge>
                  <Link
                    href="/agreements"
                    className="text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    View Lease Agreements →
                  </Link>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
