import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Truck, Plus, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function TransporterDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [vehicles, shipments, requests] = await Promise.all([
    prisma.transportVehicle.findMany({
      where: { transporterId: user.id },
      include: { shipments: true },
    }),
    prisma.shipment.findMany({
      where: { vehicle: { transporterId: user.id } },
      include: { vehicle: true, transportRequest: true },
    }),
    prisma.transportRequest.findMany({
      where: { status: "OPEN" },
      take: 5,
    }),
  ]);

  const totalCapacity = vehicles.reduce((acc, v) => acc + v.capacityTons, 0);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                Logistics Dispatch Desk: {user.fullName.split("[")[0]}
              </h1>
              <Badge variant="verified">Registered Commercial Fleet</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Base District: {user.district || "Thanjavur"} • Farm-to-Mandi Bulk Grain & Refrigerated Transport
            </p>
          </div>

          <Link
            href="/marketplaces/transport"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle to Fleet</span>
          </Link>
        </div>

        {/* Agricultural Hero Section for Logistics Desk */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-44 sm:h-52">
          <img
            src="/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg"
            alt="Farm-gate harvest collection and rural logistics in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                Logistics Dispatch Desk: {user.fullName.split("[")[0]}
              </h2>
              <p className="text-xs text-purple-100 mt-1">
                Base District: {user.district || "Thanjavur"} • Farm-to-Mandi Bulk Grain &amp; Refrigerated Transport
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard
            label="Total Fleet Vehicles"
            value={vehicles.length}
            subtext="Lorries & Mini-Trucks"
            icon={Truck}
          />
          <StatCard
            label="Total Ton Capacity"
            value={`${totalCapacity.toFixed(1)} Tons`}
            subtext="Simultaneous Haulage"
            icon={CheckCircle2}
          />
          <StatCard
            label="Active Shipments"
            value={shipments.length}
            subtext="In Transit / Scheduled"
            icon={MapPin}
          />
          <StatCard
            label="Open Freight Requests"
            value={requests.length}
            subtext="Nearby Farmer Demand"
            icon={ArrowRight}
          />
        </div>

        {/* Vehicles List */}
        <div className="agri-card p-5 mb-8">
          <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-4 flex items-center justify-between">
            <span>My Registered Transport Vehicles</span>
            <span className="text-xs text-stone-500">{vehicles.length} Units</span>
          </h3>

          <div className="space-y-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-lg border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="verified">{v.vehicleType}</Badge>
                    <h4 className="text-sm font-bold text-stone-900">{v.vehicleNumber}</h4>
                  </div>
                  <div className="text-stone-500 mt-1 flex gap-4 text-[11px]">
                    <span>Capacity: <strong>{v.capacityTons} Tons</strong></span>
                    <span>Rate: <strong>₹{v.ratePerKm}/km</strong></span>
                    <span>Refrigerated: <strong>{v.isRefrigerated ? "Yes (Cold Chain)" : "Standard Ventilated"}</strong></span>
                    <span>Base: <strong>{v.baseDistrict}</strong></span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Badge variant={v.isAvailable ? "verified" : "neutral"}>
                    {v.isAvailable ? "Available for Trip" : "Dispatched"}
                  </Badge>
                  <Link
                    href="/marketplaces/transport"
                    className="text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    Manage Trips →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
