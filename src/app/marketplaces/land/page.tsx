import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Layers, Plus, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RESOURCE_IMAGES } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function LandMarketplacePage() {
  const user = await getCurrentUser();

  const records = await prisma.landRecord.findMany({
    include: { farm: true, owner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
              <Layers className="w-3.5 h-3.5" />
              <span>Agricultural Land Registry &amp; Lease Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Agricultural Land Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Discover verified fertile farmlands available for annual lease or sharecropping with Patta documentation
            </p>
          </div>

          <Link
            href="/dashboard/landowner"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <Plus className="w-4 h-4" />
            <span>List Land Parcel</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/monsoon-ploughing.jpg"
            alt="Fertile agricultural farmland in Tamil Nadu with monsoon ploughing"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-900/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Verified Cultivable Land Parcels</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Discover prime agricultural lands with verified survey numbers, water sources, and direct lease agreements.
            </p>
          </div>
        </div>

        {/* Parcels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r, idx) => {
            const landPhotos = [
              "/images/agribridge/01-farm-projects/monsoon-ploughing.jpg",
              "/images/agribridge/01-farm-projects/traditional-ox-ploughing.jpg",
              "/images/hero/kallidaikurichi-landscape.jpg",
              "/images/agribridge/01-farm-projects/farmer-with-cattle.jpg",
              "/images/agribridge/01-farm-projects/parambu-field-preparation.jpg",
            ];
            const landPhoto = landPhotos[idx % landPhotos.length];
            return (
              <div
                key={r.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Land Parcel Image Header */}
                <div className="relative h-36 overflow-hidden bg-stone-100">
                  <img
                    src={landPhoto}
                    alt={`Farmland parcel ${r.farm?.name || ""}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <Badge variant="verified">{r.leaseType}</Badge>
                  <span className="text-sm font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                    {r.acresAvailable} Acres
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 mb-1">
                    {r.farm?.name || "Farmland Parcel"}
                  </h3>
                  <p className="text-xs text-stone-500 mb-3">
                    Owner: {r.owner.fullName.split("[")[0]} • {r.farm?.district || r.owner.district}
                  </p>

                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5 text-xs text-stone-600 mb-4">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Patta Number:</span>
                      <strong className="text-stone-900">{r.titleNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Expected Lease Rent:</span>
                      <strong className="text-[#24593c]">
                        ₹{r.expectedRentPerAcre?.toLocaleString()}/acre/year
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Soil &amp; pH:</span>
                      <strong className="text-stone-900">{r.farm?.soilType || "Clay Loam"} (pH {r.soilPh || '6.8'})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Water Irrigation:</span>
                      <strong className="text-stone-900">{r.farm?.waterSource || "Canal + Borewell"}</strong>
                    </div>
                  </div>

                  {r.notes && (
                    <p className="text-[11px] text-stone-600 italic mb-3">&ldquo;{r.notes}&rdquo;</p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Revenue Patta Verified
                  </span>
                  <Link
                    href="/projects/new"
                    className="font-semibold text-[#24593c] hover:underline"
                  >
                    Create Project on this Land →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        </div>

        {/* Empty state */}
        {records.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-9 h-9 text-[#24593c]" />
            </div>
            <p className="text-stone-500 text-sm">No land parcels currently listed for lease.</p>
          </div>
        )}
      </div>
    </div>
  );
}
