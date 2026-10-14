import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ShoppingBag, Plus, CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProduceClientActions } from "@/components/marketplaces/ProduceClientActions";

export const dynamic = "force-dynamic";

export default async function ProduceMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; district?: string }>;
}) {
  const { crop, district } = await searchParams;
  const user = await getCurrentUser();

  const where: any = { status: "AVAILABLE" };
  if (crop) where.cropName = { contains: crop };
  if (district) where.locationDistrict = district;

  const listings = await prisma.produceListing.findMany({
    where,
    include: { farmer: true, offers: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Direct Farm-to-Mandi & Wholesale Produce Trade</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Produce & Harvest Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Connect directly with millers, wholesale mandi aggregators, and institutional buyers with transparent net proceeds
            </p>
          </div>

          <ProduceClientActions currentUser={user} />
        </div>

        {/* Filter Bar */}
        <div className="my-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Crop:</span>
            <Link
              href="/marketplaces/produce"
              className={`px-2.5 py-1 rounded border ${!crop ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              All Crops
            </Link>
            <Link
              href="/marketplaces/produce?crop=Paddy"
              className={`px-2.5 py-1 rounded border ${crop === "Paddy" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Paddy (Rice)
            </Link>
            <Link
              href="/marketplaces/produce?crop=Turmeric"
              className={`px-2.5 py-1 rounded border ${crop === "Turmeric" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Turmeric
            </Link>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((l) => (
            <div
              key={l.id}
              className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={l.isPreHarvestListing ? "pending" : "verified"}>
                    {l.isPreHarvestListing ? "Pre-Harvest Forward" : "Spot Harvest"}
                  </Badge>
                  <span className="text-base font-bold text-[#24593c]">
                    ₹{l.askingPricePerKg}/kg
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">{l.cropName}</h3>
                <p className="text-xs text-stone-500 mb-3">
                  Farmer: {l.farmer.fullName.split("[")[0]} • {l.locationDistrict}
                </p>

                <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1.5 text-xs text-stone-600 mb-4">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Total Available:</span>
                    <strong className="text-stone-900">{l.quantityKg.toLocaleString()} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Quality Grade:</span>
                    <strong className="text-stone-900">{l.grade}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Expected Harvest:</span>
                    <strong className="text-stone-900">
                      {new Date(l.expectedHarvestDate).toLocaleDateString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Packaging:</span>
                    <strong className="text-stone-900">{l.packagingType}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400">
                  {l.offers.length} Offer{l.offers.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => {
                    alert(`To submit a wholesale purchase offer for '${l.cropName}', please log in as a Produce Buyer.`);
                  }}
                  className="font-semibold text-[#24593c] hover:underline"
                >
                  Make Purchase Offer →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
