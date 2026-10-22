import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Wrench, Plus, Calendar, Clock, ArrowRight, CheckCircle2, ShieldCheck, Cog } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { getMachineryImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function MachineryDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [machines, bookings] = await Promise.all([
    prisma.machinery.findMany({
      where: { ownerId: user.id },
      include: { bookings: true },
    }),
    prisma.machineryBooking.findMany({
      where: { machinery: { ownerId: user.id } },
      include: {
        machinery: true,
        renter: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agricultural Hero Section for Machinery Fleet */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-44 sm:h-52">
          <img
            src="/images/machinery/tractor.jpg"
            alt="Farm machinery fleet operations in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    Machinery Fleet Desk: {user.fullName.split("[")[0]}
                  </h1>
                  <Badge variant="verified">Verified Agro-Machinery Provider</Badge>
                </div>
                <p className="text-xs text-blue-100">
                  Base District: {user.district || "Thanjavur"} • Tractors, Drone Sprayers, Harvesters &amp; Implements
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/marketplaces/machinery"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white text-blue-900 font-medium text-xs hover:bg-blue-50 transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Equipment</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Summary Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Total Fleet Units"
            value={machines.length}
            subtext="Available for Hire"
            icon={Wrench}
          />
          <StatCard
            label="Active Bookings"
            value={bookings.length}
            subtext="Scheduled Field Hours"
            icon={Calendar}
          />
          <StatCard
            label="Operator Support"
            value="Included (100%)"
            subtext="Certified Drivers/Pilots"
            icon={CheckCircle2}
            trendPositive={true}
          />
          <StatCard
            label="Booking Value"
            value={`₹${bookings.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString()}`}
            subtext="Rental Revenue"
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Machines list (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="agri-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-800" />
                  <span>My Machinery Fleet</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {machines.length} Machine{machines.length !== 1 ? "s" : ""}
                </span>
              </div>

              {machines.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-lg overflow-hidden mx-auto mb-3 border border-stone-200">
                    <img
                      src="/images/machinery/default-machinery.jpg"
                      alt="List equipment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-stone-500">No equipment currently registered under your account.</p>
                  <Link
                    href="/marketplaces/machinery"
                    className="inline-block mt-3 px-3 py-1.5 bg-[#24593c] text-white rounded text-xs"
                  >
                    Register First Machine
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {machines.map((m) => {
                    const machImg = getMachineryImage(m.category);
                    return (
                      <div
                        key={m.id}
                        className="p-4 rounded-lg border border-stone-200 bg-white hover:border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100 relative">
                            <img
                              src={machImg.src}
                              alt={machImg.alt}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 left-1">
                              <span className="bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-bold uppercase">
                                {m.category}
                              </span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-bold text-stone-900">{m.name}</h4>
                              <Badge variant="verified">Verified</Badge>
                            </div>
                            <p className="text-stone-600 text-[11px] max-w-md line-clamp-2">{m.specs}</p>
                            <div className="text-stone-500 mt-2 flex flex-wrap gap-3 text-[11px]">
                              <span>Rate: <strong className="text-stone-900">₹{m.rentalRate}/{m.rateType.toLowerCase()}</strong></span>
                              <span>Radius: <strong className="text-stone-900">{m.serviceRadiusKm} km</strong></span>
                              <span>Operator: <strong className="text-emerald-800">{m.providesOperator ? "Included" : "Self"}</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                          <Badge variant={m.isAvailable ? "verified" : "neutral"}>
                            {m.isAvailable ? "Available" : "On Field"}
                          </Badge>
                          <Link
                            href="/marketplaces/machinery"
                            className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
                          >
                            <span>Bookings</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Recent Booking Requests & Fleet Overview */}
          <div className="space-y-6">
            <div className="agri-card p-5">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-stone-600" />
                <span>Recent Rental Inquiries</span>
              </h3>
              {bookings.length === 0 ? (
                <div className="py-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-stone-500">No rental bookings recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-3 bg-stone-50 rounded border border-stone-200 text-xs">
                      <div className="font-semibold text-stone-900">{b.machinery.name}</div>
                      <div className="text-stone-500 mt-1">
                        Renter: {b.renter.fullName.split("[")[0]} • ₹{b.totalAmount}
                      </div>
                      <div className="mt-1">
                        <Badge variant="open">{b.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Farm Mechanization Guide Banner */}
            <div className="relative rounded-xl overflow-hidden h-36">
              <img
                src="/images/machinery/drone.jpg"
                alt="Agricultural drone spray services"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/40 to-transparent flex flex-col justify-end p-3">
                <span className="text-white text-xs font-semibold">TNAU Mechanization Scheme</span>
                <p className="text-blue-200 text-[11px]">Subsidies available for custom hiring centers →</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
