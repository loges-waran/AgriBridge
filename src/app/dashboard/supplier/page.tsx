import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Plus, ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function SupplierDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                Supplier Hub: {profile?.businessName || user.fullName.split("[")[0]}
              </h1>
              <Badge variant="verified">Licensed Agri-Input Dealer</Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              District: {profile?.district || user.district || "Tiruchirappalli"} • License: {profile?.licenseNumber || "TN-AGR-SUP-84729"}
            </p>
          </div>

          <Link
            href="/marketplaces/inputs"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product to Catalog</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard
            label="Catalog SKUs"
            value={products.length}
            subtext="Certified Inputs & Seeds"
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
            value={`${profile?.deliveryRadiusKm || 75} km`}
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
            <span>Inventory Catalog & Stock</span>
            <span className="text-xs text-stone-500">{products.length} Products</span>
          </h3>

          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-lg border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={p.isOrganic ? "verified" : "neutral"}>
                      {p.category} {p.isOrganic ? "(Organic)" : ""}
                    </Badge>
                    <h4 className="text-sm font-bold text-stone-900">{p.name}</h4>
                  </div>
                  <p className="text-stone-600 text-[11px] max-w-lg">{p.description}</p>
                  <div className="text-stone-500 mt-2 flex gap-4 text-[11px]">
                    <span>Packaging: <strong>{p.packageSize}</strong></span>
                    <span>Unit Price: <strong className="text-stone-900">₹{p.unitPrice}</strong></span>
                    <span>Stock: <strong className={p.stockQuantity > 10 ? "text-emerald-700" : "text-amber-700"}>{p.stockQuantity} in stock</strong></span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Link
                    href="/marketplaces/inputs"
                    className="text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    Manage SKU →
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
