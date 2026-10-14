import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Truck, Plus, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { TransportClientActions } from "@/components/marketplaces/TransportClientActions";

export const dynamic = "force-dynamic";

export default async function TransportMarketplacePage() {
  const user = await getCurrentUser();

  const [vehicles, requests] = await Promise.all([
    prisma.transportVehicle.findMany({
      where: { isAvailable: true },
      include: { transporter: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.transportRequest.findMany({
      where: { status: "OPEN" },
      include: { requester: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-1 border border-purple-200">
              <Truck className="w-3.5 h-3.5" />
              <span>Agricultural Haulage & Mandi Freight</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Transport & Rural Logistics Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Book verified trucks, refrigerated containers, and tractor-trailers for farm-gate harvest pickup and terminal transport
            </p>
          </div>

          <TransportClientActions currentUser={user} />
        </div>

        {/* Vehicles Grid */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">
              Available Haulage Fleet ({vehicles.length} Units Stationed)
            </h2>
            <span className="text-xs text-stone-500">Commercial RTO Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={v.isRefrigerated ? "pending" : "verified"}>
                      {v.vehicleType}
                    </Badge>
                    <span className="text-sm font-bold text-purple-900">₹{v.ratePerKm}/km</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-1">{v.vehicleNumber}</h3>
                  <p className="text-xs text-stone-500 mb-3">
                    Transporter: {v.transporter.fullName.split("[")[0]} • Station: {v.baseDistrict}
                  </p>

                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5 text-xs text-stone-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Payload Capacity:</span>
                      <strong className="text-stone-900">{v.capacityTons} Metric Tons</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Body Type:</span>
                      <strong className="text-stone-900">
                        {v.isRefrigerated ? "Refrigerated (Cold Chain)" : "Standard Ventilated Cargo"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Rate Structure:</span>
                      <strong className="text-stone-900">₹{v.ratePerKm} per kilometer</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Fleet Available
                  </span>
                  <button
                    onClick={() => {
                      alert(`To book '${v.vehicleNumber}', select transport dispatch in your Farm Project Workspace or Produce Order checkout.`);
                    }}
                    className="font-semibold text-[#24593c] hover:underline"
                  >
                    Request Trip →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
