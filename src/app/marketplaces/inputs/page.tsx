import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Package, Plus, CheckCircle2, ShoppingCart, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { InputClientActions } from "@/components/marketplaces/InputClientActions";
import { getInputImage } from "@/lib/imageMap";

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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-1 border border-teal-200">
              <Package className="w-3.5 h-3.5" />
              <span>Certified Agri-Inputs, Seeds &amp; Biological Supplies</span>
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

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/resources/fertilizer.jpg"
            alt="Certified organic fertilizers and agricultural inputs"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Verified Input Store</p>
            <p className="text-teal-100 text-xs mt-1 max-w-sm">
              Certified seed varieties, bio-fertilizers, organic neem formulations, and micro-irrigation systems delivered straight to the farm.
            </p>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mb-6 p-4 bg-white rounded-lg border border-stone-200 flex flex-wrap items-center gap-4 text-xs">
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
          {products.map((p) => {
            const inputImg = getInputImage(p.category);
            return (
              <div
                key={p.id}
                className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
              >
                {/* Product Image Header */}
                <div className="relative h-36 overflow-hidden bg-stone-100">
                  <img
                    src={inputImg.src}
                    alt={inputImg.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
                    <Badge variant={p.isOrganic ? "verified" : "neutral"}>
                      {p.isOrganic ? "Organic Certified" : p.category}
                    </Badge>
                    <span className="text-[11px] text-white font-semibold bg-black/40 px-2 py-0.5 rounded">
                      {p.packageSize}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
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

                    <Link
                      href="/projects"
                      className="block text-center w-full py-1.5 px-3 bg-[#24593c] text-white font-medium text-xs rounded hover:bg-[#1e4731] transition-colors"
                    >
                      Order for Project
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-9 h-9 text-teal-700" />
            </div>
            <p className="text-stone-500 text-sm">No input products available for the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
