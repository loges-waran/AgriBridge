import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Truck, Plus, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { TransportClientActions } from "@/components/marketplaces/TransportClientActions";
import { RESOURCE_IMAGES } from "@/lib/imageMap";

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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-semibold mb-1 border border-purple-200">
              <Truck className="w-3.5 h-3.5" />
              <span>Agricultural Haulage &amp; Mandi Freight</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Transport &amp; Rural Logistics Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Book verified trucks, refrigerated containers, and tractor-trailers for farm-gate harvest pickup and terminal transport
            </p>
          </div>

          <TransportClientActions currentUser={user} />
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/carrying-rice-seedlings.jpg"
            alt="Farm-gate harvest collection and rural logistics in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/85 via-purple-900/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Farm-Gate to Mandi Logistics</p>
            <p className="text-purple-100 text-xs mt-1 max-w-sm">
              Commercial RTO verified vehicles for bulk grain, perishable banana/vegetable transport, and terminal hub delivery.
            </p>
          </div>
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
            {vehicles.map((v, vIdx) => {
              const transportPhotos = [
                "/images/resources/transport.jpg",
                "/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg",
                "/images/agribridge/01-farm-projects/carrying-rice-seedlings.jpg",
              ];
              const vehiclePhoto = transportPhotos[vIdx % transportPhotos.length];
              return (
              <div
                key={v.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Vehicle Image Header */}
                <div className="relative h-36 overflow-hidden bg-stone-100">
                  <img
                    src={vehiclePhoto}
                    alt={`Haulage vehicle ${v.vehicleType}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <Badge variant={v.isRefrigerated ? "pending" : "verified"}>
                      {v.vehicleType}
                    </Badge>
                    <span className="text-sm font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                      ₹{v.ratePerKm}/km
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
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

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fleet Available
                    </span>
                    <Link
                      href="/projects"
                      className="font-semibold text-[#24593c] hover:underline"
                    >
                      Request Trip →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          </div>

          {/* Empty state */}
          {vehicles.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-9 h-9 text-purple-700" />
              </div>
              <p className="text-stone-500 text-sm">No transport vehicles currently listed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
