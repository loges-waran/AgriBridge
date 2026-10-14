import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Package, Plus, CheckCircle2, ShoppingCart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { InputClientActions } from "@/components/marketplaces/InputClientActions";

export const dynamic = "force-dynamic";

export default async function InputMarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const user = await getCurrentUser();

  const where: any = { stockQuantity: { gt: 0 } };
  if (category) where.category = category;

  const products = await prisma.inputProduct.findMany({
    where,
    include: { supplier: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-1 border border-teal-200">
              <Package className="w-3.5 h-3.5" />
              <span>Certified Agri-Inputs, Seeds & Biological Supplies</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Agricultural Inputs Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Source high-germination certified seeds, bio-NPK composts, neem bio-pesticides, and drip kits from licensed local suppliers
            </p>
          </div>

          <InputClientActions currentUser={user} />
        </div>

        {/* Categories Bar */}
        <div className="my-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-700">Category:</span>
            <Link
              href="/marketplaces/inputs"
              className={`px-2.5 py-1 rounded border ${!category ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              All Inputs
            </Link>
            <Link
              href="/marketplaces/inputs?category=SEED"
              className={`px-2.5 py-1 rounded border ${category === "SEED" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Certified Seeds
            </Link>
            <Link
              href="/marketplaces/inputs?category=FERTILIZER"
              className={`px-2.5 py-1 rounded border ${category === "FERTILIZER" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Bio-Fertilizer
            </Link>
            <Link
              href="/marketplaces/inputs?category=ORGANIC_PESTICIDE"
              className={`px-2.5 py-1 rounded border ${category === "ORGANIC_PESTICIDE" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Bio-Pesticides
            </Link>
            <Link
              href="/marketplaces/inputs?category=IRRIGATION"
              className={`px-2.5 py-1 rounded border ${category === "IRRIGATION" ? "bg-[#24593c] text-white border-[#24593c]" : "bg-stone-50 text-stone-700 border-stone-200"}`}
            >
              Drip Kits
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={p.isOrganic ? "verified" : "neutral"}>
                    {p.isOrganic ? "Organic Certified" : p.category}
                  </Badge>
                  <span className="text-xs text-stone-500 font-semibold">{p.packageSize}</span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 mb-1">{p.name}</h3>
                <p className="text-[11px] text-stone-500 mb-2">
                  Brand: {p.brand || "Certified"} • By: {p.supplier.businessName}
                </p>

                <p className="text-xs text-stone-600 line-clamp-2 mb-3 leading-relaxed">
                  {p.description || "Certified agricultural grade input."}
                </p>
              </div>

              <div>
                <div className="p-2.5 bg-stone-50 rounded border border-stone-200 flex items-center justify-between mb-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Price</span>
                    <strong className="text-stone-900 text-sm">₹{p.unitPrice}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Stock</span>
                    <strong className={p.stockQuantity > 10 ? "text-emerald-700" : "text-amber-700"}>
                      {p.stockQuantity} Left
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`To purchase '${p.name}', please select this input from your Farm Project Workspace matching page to automatically bind expenses.`);
                  }}
                  className="w-full py-1.5 px-3 bg-[#24593c] text-white font-medium text-xs rounded hover:bg-[#1e4731] transition-colors"
                >
                  Order for Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
