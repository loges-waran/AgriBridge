import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ShoppingBag, Plus, CheckCircle2, Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProduceClientActions } from "@/components/marketplaces/ProduceClientActions";
import { getCropImage, getProjectCardImage } from "@/lib/imageMap";

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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Direct Farm-to-Mandi &amp; Wholesale Produce Trade</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Produce &amp; Harvest Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Connect directly with millers, wholesale mandi aggregators, and institutional buyers with transparent net proceeds
            </p>
          </div>

          <ProduceClientActions currentUser={user} />
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/resources/produce.jpg"
            alt="Koyambedu wholesale produce mandi in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e4731]/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Farm-to-Market Platform</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              List paddy, turmeric, banana, and specialty produce for direct wholesale, forward contracts, and mandi aggregation.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
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
          {listings.map((l) => {
            const cropImg = getProjectCardImage(l.cropName, l.id);
            return (
              <div
                key={l.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Crop Image */}
                <div className="relative h-40 overflow-hidden bg-stone-100">
                  <img
                    src={cropImg.src}
                    alt={cropImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <Badge variant={l.isPreHarvestListing ? "pending" : "verified"}>
                      {l.isPreHarvestListing ? "Pre-Harvest Forward" : "Spot Harvest"}
                    </Badge>
                    <span className="text-base font-bold text-white bg-black/30 px-2 py-0.5 rounded">
                      ₹{l.askingPricePerKg}/kg
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
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

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs mt-auto">
                    <span className="text-stone-400">
                      {l.offers.length} Offer{l.offers.length !== 1 ? "s" : ""}
                    </span>
                    <Link
                      href="/login"
                      className="font-semibold text-[#24593c] hover:underline"
                    >
                      Make Purchase Offer →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {listings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-9 h-9 text-[#24593c]" />
            </div>
            <p className="text-stone-500 text-sm">No produce listings found for current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
