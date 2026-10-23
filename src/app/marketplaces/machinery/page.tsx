import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Wrench, Plus, CheckCircle2, MapPin, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { MachineryClientActions } from "@/components/marketplaces/MachineryClientActions";
import { getMachineryImage } from "@/lib/imageMap";

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

  let machines: any[] = [];
  try {
    machines = await prisma.machinery.findMany({
      where,
      include: { owner: true, bookings: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Machinery query error:", error);
  }

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-1 border border-blue-200">
              <Wrench className="w-3.5 h-3.5" />
              <span>Farm Mechanization &amp; Implement Rentals</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Machinery &amp; Equipment Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Rent 4WD tractors, laser levelers, rotavators, drone sprayers, and combine harvesters with trained operators
            </p>
          </div>

          <MachineryClientActions currentUser={user} />
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/machinery/tractor.jpg"
            alt="Modern farm tractors and machinery in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Farm Mechanization Hub</p>
            <p className="text-blue-100 text-xs mt-1 max-w-sm">
              Book verified tractors, drone sprayers, harvesters, and tillers with trained operators for your cultivation project.
            </p>
          </div>
        </div>

        {/* Category icons row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Tractors", img: "/images/machinery/tractor.jpg", cat: "TRACTOR" },
            { label: "Harvesters", img: "/images/machinery/harvester.jpg", cat: "HARVESTER" },
            { label: "Drone Sprayers", img: "/images/machinery/drone.jpg", cat: "DRONE" },
            { label: "Tillers & Pumps", img: "/images/machinery/tiller.jpg", cat: "TILLER" },
          ].map((item) => (
            <Link
              key={item.cat}
              href={`/marketplaces/machinery?category=${item.cat}`}
              className={`relative rounded-lg overflow-hidden h-16 sm:h-20 border-2 transition-colors ${category === item.cat ? "border-[#24593c]" : "border-transparent hover:border-stone-300"}`}
            >
              <img src={item.img} alt={item.label} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-[10px] sm:text-xs font-bold text-center px-1">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Filter Pills */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
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
          {machines.map((m) => {
            const machImg = getMachineryImage(m.category);
            return (
              <div
                key={m.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Machine Image */}
                <div className="relative h-40 overflow-hidden bg-stone-100">
                  <img
                    src={machImg.src}
                    alt={machImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <Badge variant="verified">{m.category}</Badge>
                    <span className="text-sm font-bold text-white bg-black/30 px-2 py-0.5 rounded">
                      ₹{m.rentalRate}/{m.rateType.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
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

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Unit
                    </span>
                    <Link
                      href="/projects"
                      className="font-semibold text-[#24593c] hover:underline"
                    >
                      Book Rental →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {machines.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-9 h-9 text-blue-700" />
            </div>
            <p className="text-stone-500 text-sm">No machinery available for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
