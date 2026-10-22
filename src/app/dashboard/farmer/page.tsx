import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Sprout,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  Users,
  Wrench,
  Coins,
  ShoppingBag,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCropImage, getProjectCardImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function FarmerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Load farmer's farms, projects, resource gaps, listings, and orders
  const [farms, projects, produceListings, inputOrders] = await Promise.all([
    prisma.farm.findMany({
      where: { ownerId: user.id },
      include: { landRecords: true },
    }),
    prisma.farmProject.findMany({
      where: { farmerId: user.id },
      include: {
        resourceGaps: true,
        milestones: true,
        expenses: true,
        investmentProposals: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.produceListing.findMany({
      where: { farmerId: user.id },
      include: { offers: true },
    }),
    prisma.inputOrder.findMany({
      where: { farmerId: user.id },
      include: { items: { include: { product: true } } },
    }),
  ]);

  const totalAcres = farms.reduce((acc, f) => acc + f.totalAcres, 0);
  const totalOpenGaps = projects.reduce(
    (acc, p) => acc + p.resourceGaps.filter((g) => g.status === "OPEN").length,
    0
  );
  const totalExpenses = projects.reduce(
    (acc, p) => acc + p.expenses.reduce((eAcc, e) => eAcc + e.amount, 0),
    0
  );

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agricultural Hero Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-44 sm:h-52">
          <img
            src="/images/hero/tamilnadu-farmland-hero.jpg"
            alt="Authentic lush farmland and paddy in Tamil Nadu Cauvery Delta"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e4731]/90 via-[#24593c]/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    Farmer Workspace: {user.fullName.split("[")[0]}
                  </h1>
                  <Badge variant={user.kycStatus === "VERIFIED" ? "verified" : "pending"}>
                    {user.kycStatus === "VERIFIED" ? "Verified Cultivator" : "KYC Pending"}
                  </Badge>
                </div>
                <p className="text-xs text-emerald-100">
                  District: {user.district || "Thanjavur"}, {user.state} • Role: {user.activeRole}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white text-[#24593c] font-medium text-xs hover:bg-emerald-50 transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Farm Project</span>
                </Link>
                <Link
                  href="/marketplaces/produce"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-white/40 bg-white/10 text-white font-medium text-xs hover:bg-white/20 transition-colors"
                >
                  <span>List Harvest</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Summary Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Farmland"
            value={`${totalAcres || 12} Acres`}
            subtext={`${farms.length || 1} Registered Parcels`}
            icon={Layers}
          />
          <StatCard
            label="Active Projects"
            value={projects.length}
            subtext={`${totalOpenGaps} Open Resource Gaps`}
            icon={Sprout}
            trendPositive={totalOpenGaps === 0}
          />
          <StatCard
            label="Produce Listings"
            value={produceListings.length}
            subtext={`${produceListings.reduce((acc, l) => acc + l.offers.length, 0)} Buyer Offers`}
            icon={ShoppingBag}
          />
          <StatCard
            label="Recorded Expenses"
            value={`₹${totalExpenses.toLocaleString()}`}
            subtext="Cultivation Outflows"
            icon={Coins}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="agri-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#24593c]" />
                  <span>My Active Farming Projects</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {projects.length} Project{projects.length !== 1 ? "s" : ""}
                </span>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  {/* Placeholder illustration when no projects */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden mx-auto mb-3 border border-stone-200">
                    <img
                      src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
                      alt="Start your first farm project"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-stone-500">You have not registered any farming projects yet.</p>
                  <Link
                    href="/projects/new"
                    className="inline-block mt-3 px-3 py-1.5 bg-[#24593c] text-white rounded text-xs"
                  >
                    Create Your First Project
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((p) => {
                    const openGaps = p.resourceGaps.filter((g) => g.status === "OPEN");
                    const cropImg = getProjectCardImage(p.cropName, p.id);
                    return (
                      <div
                        key={p.id}
                        className="rounded-lg border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors overflow-hidden"
                      >
                        {/* Crop image strip */}
                        <div className="relative h-24 overflow-hidden">
                          <img
                            src={cropImg.src}
                            alt={cropImg.alt}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                          <div className="absolute inset-0 flex items-center px-4 gap-3">
                            <div>
                              <span className="text-sm font-bold text-white drop-shadow">{p.title}</span>
                              <span className="text-xs text-white/80 ml-2">
                                • {p.acresAllotted} Acres ({p.season})
                              </span>
                            </div>
                            <div className="ml-auto">
                              <Badge variant={p.status === "READY_TO_START" ? "verified" : "open"}>
                                {p.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <p className="text-xs text-stone-600 mb-3">
                            {p.description || "Active cultivation cycle."}
                          </p>

                          {/* Resource Gap Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[11px] font-semibold text-stone-500 uppercase">
                              Open Gaps:
                            </span>
                            {openGaps.length === 0 ? (
                              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> All Resources Fulfilled
                              </span>
                            ) : (
                              openGaps.map((g) => (
                                <span
                                  key={g.id}
                                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200"
                                >
                                  {g.category}: {g.quantityNeeded ? `${g.quantityNeeded} ${g.unit || ''}` : g.title}
                                </span>
                              ))
                            )}
                          </div>

                          {/* Project Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-stone-200 text-xs">
                            <Link
                              href={`/projects/${p.id}/matches`}
                              className="font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
                            >
                              <span>Run Resource Gap Matching</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/projects/${p.id}`}
                              className="font-semibold text-[#24593c] hover:underline"
                            >
                              View Workspace &amp; Budget →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Produce Listings & Buyer Negotiations */}
            <div className="agri-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#24593c]" />
                  <span>Produce Listings &amp; Buyer Offers</span>
                </h3>
                <Link
                  href="/marketplaces/produce"
                  className="text-xs font-semibold text-[#24593c] hover:underline"
                >
                  Manage Listings
                </Link>
              </div>

              {produceListings.length === 0 ? (
                <div className="flex items-center gap-4 py-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=70"
                      alt="List your harvest"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-stone-500">
                    No active produce listings. You can list upcoming harvests to negotiate pre-harvest forward contracts.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {produceListings.map((l) => {
                    const cropImg = getCropImage(l.cropName);
                    return (
                      <div
                        key={l.id}
                        className="p-3 rounded border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                            <img
                              src={cropImg.src}
                              alt={cropImg.alt}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900">
                              {l.cropName} ({l.grade}) • {l.quantityKg.toLocaleString()} kg
                            </div>
                            <div className="text-stone-500 text-[11px] mt-0.5">
                              Asking: ₹{l.askingPricePerKg}/kg • Packaging: {l.packagingType}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-amber-700">
                            {l.offers.length} Offer{l.offers.length !== 1 ? "s" : ""}
                          </span>
                          <Badge variant="verified">{l.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Registered Farms & Input Orders */}
          <div className="space-y-6">
            {/* Registered Farms */}
            <div className="agri-card p-5">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#24593c]" />
                <span>My Registered Farms</span>
              </h3>
              {farms.length === 0 ? (
                <div className="text-center py-4">
                  <div className="w-full h-28 rounded-lg overflow-hidden border border-stone-200 mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=70"
                      alt="Register your farm parcel"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-stone-500">No farms registered under your profile.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {farms.map((f) => (
                    <div key={f.id} className="p-3 bg-stone-50 rounded border border-stone-200 text-xs">
                      <div className="font-semibold text-stone-900">{f.name}</div>
                      <div className="text-stone-500 mt-1">
                        {f.totalAcres} Acres • Survey: {f.surveyNumber || "N/A"}
                      </div>
                      <div className="text-stone-500 mt-0.5">
                        Soil: {f.soilType || "Clay Loam"} • Water: {f.waterSource || "Borewell"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Marketplace Access */}
            <div className="agri-card p-5">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3">
                Quick Resource Booking
              </h3>
              <div className="space-y-2 text-xs">
                <Link
                  href="/marketplaces/labour"
                  className="flex items-center justify-between p-2 rounded hover:bg-stone-50 border border-stone-200 font-medium text-stone-700"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Book Labour Gang</span>
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  href="/marketplaces/machinery"
                  className="flex items-center justify-between p-2 rounded hover:bg-stone-50 border border-stone-200 font-medium text-stone-700"
                >
                  <span className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-700" />
                    <span>Rent Tractor / Drone</span>
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  href="/marketplaces/inputs"
                  className="flex items-center justify-between p-2 rounded hover:bg-stone-50 border border-stone-200 font-medium text-stone-700"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-stone-700" />
                    <span>Order Bio-Fertilizer / Seeds</span>
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  href="/marketplaces/transport"
                  className="flex items-center justify-between p-2 rounded hover:bg-stone-50 border border-stone-200 font-medium text-stone-700"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-700" />
                    <span>Request Mandi Haulage</span>
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Seasonal farming tip banner */}
            <div className="relative rounded-xl overflow-hidden h-28">
              <img
                src="https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&q=80"
                alt="Seasonal crop cultivation tips"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e4731]/90 via-[#24593c]/40 to-transparent flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold">Samba Season Active</p>
                <p className="text-emerald-100 text-[11px]">Check Crop Advisory for irrigation tips →</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
