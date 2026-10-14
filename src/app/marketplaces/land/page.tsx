import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Layers, Plus, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
              <Layers className="w-3.5 h-3.5" />
              <span>Agricultural Land Registry & Lease Engine</span>
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

        {/* Parcels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {records.map((r) => (
            <div
              key={r.id}
              className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="verified">{r.leaseType}</Badge>
                  <span className="text-sm font-bold text-stone-900">
                    {r.acresAvailable} Acres
                  </span>
                </div>

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
                    <span className="text-stone-400">Soil & pH:</span>
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

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
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
          ))}
        </div>
      </div>
    </div>
  );
}
