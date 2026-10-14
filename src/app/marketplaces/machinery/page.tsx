import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Wrench, Plus, CheckCircle2, MapPin, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MachineryClientActions } from "@/components/marketplaces/MachineryClientActions";

export const dynamic = "force-dynamic";

export default async function MachineryMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; district?: string }>;
}) {
  const { category, district } = await searchParams;
  const user = await getCurrentUser();

  const where: any = { isAvailable: true };
  if (category) where.category = category;
  if (district) where.district = district;

  const machines = await prisma.machinery.findMany({
    where,
    include: { owner: true, bookings: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-1 border border-blue-200">
              <Wrench className="w-3.5 h-3.5" />
              <span>Farm Mechanization & Implement Rentals</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Machinery & Equipment Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Rent 4WD tractors, laser levelers, rotavators, drone sprayers, and combine harvesters with trained operators
            </p>
          </div>

          <MachineryClientActions currentUser={user} />
        </div>

        {/* Filter Pills */}
        <div className="my-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Category:</span>
            <Link
              href="/marketplaces/machinery"
              className={`px-2.5 py-1 rounded border ${!category ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              All Machinery
            </Link>
            <Link
              href="/marketplaces/machinery?category=TRACTOR"
              className={`px-2.5 py-1 rounded border ${category === "TRACTOR" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Tractors
            </Link>
            <Link
              href="/marketplaces/machinery?category=DRONE"
              className={`px-2.5 py-1 rounded border ${category === "DRONE" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Drone Sprayers
            </Link>
            <Link
              href="/marketplaces/machinery?category=HARVESTER"
              className={`px-2.5 py-1 rounded border ${category === "HARVESTER" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Harvesters
            </Link>
          </div>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((m) => (
            <div
              key={m.id}
              className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="verified">{m.category}</Badge>
                  <span className="text-sm font-bold text-blue-900">
                    ₹{m.rentalRate}/{m.rateType.toLowerCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">{m.name}</h3>
                <p className="text-xs text-stone-500 mb-3">
                  Owner: {m.owner.fullName.split("[")[0]} • District: {m.district}
                </p>

                <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5 text-xs text-stone-600 mb-4">
                  <p className="text-[11px] leading-relaxed text-stone-700">{m.specs || "Standard farm specifications."}</p>
                  <div className="pt-1 text-[11px] text-stone-500 flex justify-between">
                    <span>Service Radius: <strong>{m.serviceRadiusKm} km</strong></span>
                    <span>Operator: <strong>{m.providesOperator ? "Included" : "Self"}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Unit
                </span>
                <button
                  onClick={() => {
                    alert(`To book '${m.name}' at ₹${m.rentalRate}/${m.rateType.toLowerCase()}, please log in as a farmer and book against your project.`);
                  }}
                  className="font-semibold text-[#24593c] hover:underline"
                >
                  Book Rental →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
