import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Wrench, Plus, Calendar, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                Machinery Fleet Desk: {user.fullName.split("[")[0]}
              </h1>
              <Badge variant="verified">Verified Agro-Machinery Provider</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Base District: {user.district || "Thanjavur"} • Tractors, Drone Sprayers, Harvesters
            </p>
          </div>

          <Link
            href="/marketplaces/machinery"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <Plus className="w-4 h-4" />
            <span>List New Equipment</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
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
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-4 flex items-center justify-between">
                <span>My Machinery Fleet</span>
                <span className="text-xs text-stone-500">{machines.length} Machines</span>
              </h3>

              <div className="space-y-4">
                {machines.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-lg border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="verified">{m.category}</Badge>
                        <h4 className="text-sm font-bold text-stone-900">{m.name}</h4>
                      </div>
                      <p className="text-stone-600 text-[11px] max-w-md">{m.specs}</p>
                      <div className="text-stone-500 mt-2 flex gap-3 text-[11px]">
                        <span>Rate: <strong className="text-stone-900">₹{m.rentalRate}/{m.rateType.toLowerCase()}</strong></span>
                        <span>Radius: <strong className="text-stone-900">{m.serviceRadiusKm} km</strong></span>
                        <span>Operator: <strong className="text-emerald-800">{m.providesOperator ? "Included" : "Self"}</strong></span>
                      </div>
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2">
                      <Badge variant={m.isAvailable ? "verified" : "neutral"}>
                        {m.isAvailable ? "Available" : "On Field"}
                      </Badge>
                      <Link
                        href="/marketplaces/machinery"
                        className="text-xs font-semibold text-[#24593c] hover:underline"
                      >
                        Calendar & Bookings →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Recent Booking Requests */}
          <div className="space-y-6">
            <div className="agri-card p-5">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3">
                Recent Rental Inquiries
              </h3>
              {bookings.length === 0 ? (
                <p className="text-xs text-stone-500">No rental bookings recorded yet.</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
