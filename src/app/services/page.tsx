import React from "react";
import Link from "next/link";
import {
  Users,
  Wrench,
  Package,
  ShoppingBag,
  Coins,
  Truck,
  Layers,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Agricultural Labour Gangs",
      category: "Human Capital",
      desc: "Connect directly with skilled farm worker crews for nursery raising, line transplanting, weeding, pruning, and crop harvesting. Transparent daily wage rates and transparent terms.",
      link: "/marketplaces/labour",
      icon: Users,
    },
    {
      title: "Machinery & Equipment Rental",
      category: "Mechanization",
      desc: "Hourly and per-acre rental of 4WD tractors, rotavators, laser levelers, combine harvesters, and DGCA-certified drone sprayers with trained operators.",
      link: "/marketplaces/machinery",
      icon: Wrench,
    },
    {
      title: "Certified Inputs & Seeds",
      category: "Farm Supplies",
      desc: "Purchase high-germination certified seed varieties, bio-NPK fertilizers, trichoderma bio-inoculants, and gravity drip irrigation units directly from licensed local dealers.",
      link: "/marketplaces/inputs",
      icon: Package,
    },
    {
      title: "Produce & Buyer Forward Contracts",
      category: "Commerce",
      desc: "Connect with wholesale mandi aggregators, millers, and institutional buyers. Negotiate advance pre-harvest supply agreements with transparent quality metrics.",
      link: "/marketplaces/produce",
      icon: ShoppingBag,
    },
    {
      title: "Co-Farming & Project Financing",
      category: "Capital",
      desc: "Debt-free working capital co-investment for verified farm cycles. Structure profit-share agreements with milestone-based disbursement tracking.",
      link: "/marketplaces/investment",
      icon: Coins,
    },
    {
      title: "Rural Logistics & Mandi Haulage",
      category: "Transport",
      desc: "Book 3.5-ton mini-trucks, tractor trailers, or 10-ton lorries for prompt field-to-mandi crop haulage with clear per-km pricing.",
      link: "/marketplaces/transport",
      icon: Truck,
    },
    {
      title: "Agricultural Land Leasing",
      category: "Real Estate",
      desc: "List and lease verified agricultural plots with verified Patta/Chitta documentation, soil reports, and water canal rights.",
      link: "/marketplaces/land",
      icon: Layers,
    },
    {
      title: "Crop Advisory & Agronomic Intelligence",
      category: "Science",
      desc: "Consult agro-climatic crop suitability guidelines, Tamil Nadu seasonal calendars (Kuruvai, Samba, Navarai), and budget scenario planning.",
      link: "/intelligence/crop-advisory",
      icon: Sparkles,
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-[#fbfbfa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-[#24593c] uppercase tracking-wider">
            Ecosystem Directory
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-2">
            AgriBridge Agricultural Services
          </h1>
          <p className="mt-2 text-stone-600 text-sm">
            Everything required to cultivate, harvest, and market a crop successfully under one verified roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="agri-card p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      {s.category}
                    </span>
                    <Icon className="w-5 h-5 text-[#24593c]" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-2">{s.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-5 pt-3 border-t border-stone-100">
                  <Link
                    href={s.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    <span>Access Marketplace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
