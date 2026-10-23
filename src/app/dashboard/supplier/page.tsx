import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Plus, ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { getInputImage } from "@/lib/imageMap";

export const dynamic = "force-dynamic";

export default async function SupplierDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("SUPPLIER")) redirect("/dashboard");

  const [profile, products] = await Promise.all([
    prisma.supplierProfile.findUnique({
      where: { userId: user.id },
      include: {
        products: { include: { orderItems: true } },
      },
    }),
    prisma.inputProduct.findMany({
      where: { supplier: { userId: user.id } },
      include: { orderItems: true },
    }),
  ]);

  const totalStock = products.reduce((acc, p) => acc + p.stockQuantity, 0);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agricultural Hero Section for Supplier Hub */}
        <div className="relative rounded-xl overflow-hidden mb-6 h-44 sm:h-52">
          <img
            src="/images/resources/fertilizer.jpg"
            alt="Licensed agricultural inputs warehouse and supply operations"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950/90 via-teal-900/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow">
                    Supplier Hub: {profile?.businessName || user.fullName.split("[")[0]}
                  </h1>
                  <Badge variant="verified">Licensed Agri-Input Dealer</Badge>
                </div>
                <p className="text-xs text-teal-100">
                  District: {profile?.district || user.district || "Tiruchirappalli"} • License: {profile?.licenseNumber || "TN-AGR-SUP-84729"}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/marketplaces/inputs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white text-teal-900 font-medium text-xs hover:bg-teal-50 transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product to Catalog</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Summary Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="Catalog SKUs"
            value={products.length}
            subtext="Certified Inputs &amp; Seeds"
            icon={Package}
          />
          <StatCard
            label="Total Available Units"
            value={totalStock.toLocaleString()}
            subtext="In Warehouse Inventory"
            icon={ShoppingCart}
          />
          <StatCard
            label="Delivery Radius"
            value={profile?.deliveryRadiusKm ? `${profile.deliveryRadiusKm} km` : "District Fleet"}
            subtext="Doorstep Delivery"
            icon={CheckCircle2}
            trendPositive={true}
          />
          <StatCard
            label="Organic Certified"
            value={`${products.filter((p) => p.isOrganic).length} SKUs`}
            subtext="Zero Chemical Bio-Inputs"
            icon={CheckCircle2}
          />
        </div>

        {/* Product Catalog List */}
        <div className="agri-card p-5">
          <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-4 flex items-center justify-between">
            <span>Inventory Catalog &amp; Stock</span>
            <span className="text-xs text-stone-500">{products.length} Products</span>
          </h3>

          {products.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/60">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center mx-auto mb-2">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-stone-800">No Catalog Products Registered</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Your input inventory is currently empty. Add certified seeds, bio-fertilizers, or micro-nutrients to your catalog.
              </p>
              <Link
                href="/marketplaces/inputs"
                className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 bg-[#24593c] text-white rounded-lg text-xs font-bold hover:bg-[#1a402a] shadow-xs"
              >
                <span>Add Product to Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
            {products.map((p) => {
              const inImg = getInputImage(p.category);
              return (
                <div
                  key={p.id}
                  className="p-4 rounded-lg border border-stone-200 bg-white hover:border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                      <img
                        src={inImg.src}
                        alt={inImg.alt}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={p.isOrganic ? "verified" : "neutral"}>
                          {p.category} {p.isOrganic ? "(Organic)" : ""}
                        </Badge>
                        <h4 className="text-sm font-bold text-stone-900">{p.name}</h4>
                      </div>
                      <p className="text-stone-600 text-[11px] max-w-lg">{p.description}</p>
                      <div className="text-stone-500 mt-2 flex flex-wrap gap-4 text-[11px]">
                        <span>Packaging: <strong>{p.packageSize}</strong></span>
                        <span>Unit Price: <strong className="text-stone-900">₹{p.unitPrice}</strong></span>
                        <span>Stock: <strong className={p.stockQuantity > 10 ? "text-emerald-700" : "text-amber-700"}>{p.stockQuantity} in stock</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <Link
                      href="/marketplaces/inputs"
                      className="text-xs font-semibold text-[#24593c] hover:underline flex items-center gap-1"
                    >
                      <span>Manage SKU</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
