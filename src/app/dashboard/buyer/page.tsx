import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, FileText, Truck, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { getCropImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function BuyerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("BUYER")) redirect("/dashboard");

  const [profile, myOffers, myOrders, availableListings] = await Promise.all([
    prisma.buyerProfile.findUnique({
      where: { userId: user.id },
    }),
    prisma.buyerOffer.findMany({
      where: { buyerId: user.id },
      include: {
        listing: { include: { farmer: true } },
      },
    }),
    prisma.purchaseOrder.findMany({
      where: { buyerId: user.id },
      include: {
        listing: { include: { farmer: true } },
        shipments: true,
      },
    }),
    prisma.produceListing.findMany({
      where: { status: "AVAILABLE" },
      include: { farmer: true },
      take: 6,
    }),
  ]);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agricultural Hero Section for Buyer Desk */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-44 sm:h-52">
          <img
            src="/images/resources/produce.jpg"
            alt="Wholesale produce procurement and mandi aggregator hub"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    Buyer &amp; Trader Desk: {profile?.businessName || user.fullName.split("[")[0]}
                  </h1>
                  <Badge variant="verified">GST Verified Trader</Badge>
                </div>
                <p className="text-xs text-emerald-100">
                  Location: {profile?.district || user.district || "Madurai"} • Direct Farmer Sourcing &amp; Pre-Harvest Forward Contracts
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/marketplaces/produce"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white text-[#24593c] font-medium text-xs hover:bg-emerald-50 transition-colors shadow"
                >
                  <span>Explore Farm Harvests</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Summary Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Active Purchase Offers"
            value={myOffers.length}
            subtext="In Negotiation"
            icon={FileText}
          />
          <StatCard
            label="Confirmed Orders"
            value={myOrders.length}
            subtext="Mandi / Direct Sourcing"
            icon={ShoppingBag}
          />
          <StatCard
            label="Preferred Commodities"
            value={profile?.preferredCrops ? profile.preferredCrops.split(",").slice(0, 2).join(" & ") : "Paddy & Turmeric"}
            subtext="Procurement Focus"
            icon={CheckCircle2}
          />
          <StatCard
            label="Dispatched Shipments"
            value={myOrders.reduce((acc, o) => acc + o.shipments.length, 0)}
            subtext="Tracked Haulage"
            icon={Truck}
          />
        </div>

        {/* Available Farm Harvests Preview */}
        <div className="agri-card p-5 mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="text-sm font-bold text-stone-900">
              Verified Farm Harvests Ready for Pre-Booking / Purchase
            </h3>
            <Link
              href="/marketplaces/produce"
              className="text-xs font-semibold text-[#24593c] hover:underline"
            >
              Browse Full Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableListings.map((l) => {
              const cropImg = getCropImage(l.cropName);
              return (
                <div
                  key={l.id}
                  className="rounded-lg border border-stone-200 bg-white hover:border-[#24593c] transition-colors flex flex-col justify-between overflow-hidden text-xs"
                >
                  {/* Crop Image Header */}
                  <div className="relative h-28 overflow-hidden bg-stone-100">
                    <img
                      src={cropImg.src}
                      alt={cropImg.alt}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                      <Badge variant={l.grade === "ORGANIC_CERTIFIED" ? "verified" : "neutral"}>
                        {l.grade}
                      </Badge>
                      <span className="text-xs font-bold text-white bg-black/40 px-2 py-0.5 rounded">
                        ₹{l.askingPricePerKg}/kg
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 mb-1">{l.cropName}</h4>
                      <p className="text-xs text-stone-500 mb-1">
                        Variety: {l.variety || "Standard"} • Total: {l.quantityKg.toLocaleString()} kg
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Farmer: {l.farmer.fullName.split("[")[0]} ({l.locationDistrict})
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-stone-400 text-[11px]">
                        Harvest: {new Date(l.expectedHarvestDate).toLocaleDateString()}
                      </span>
                      <Link
                        href="/marketplaces/produce"
                        className="font-semibold text-[#24593c] hover:underline"
                      >
                        Make Offer →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
