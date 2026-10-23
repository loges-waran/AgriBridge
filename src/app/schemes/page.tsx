import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sprout,
  Wrench,
  Droplet,
  Coins,
  Umbrella,
  Sun,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Government Schemes & Agricultural Subsidies | AgriBridge Tamil Nadu",
  description:
    "Official directory of Tamil Nadu and Central Government agricultural welfare schemes, machinery subsidies, crop insurance, and direct benefit packages.",
};

const SCHEMES = [
  {
    id: "kuruvai-package",
    title: "Kuruvai Cultivation Package 2026",
    tamilTitle: "குறுவை சாகுபடி சிறப்பு தொகுப்புத் திட்டம்",
    category: "CROP_INPUTS",
    categoryLabel: "Seeds & Bio-Inputs",
    agency: "Department of Agriculture & Farmers Welfare, GoTN",
    subsidy: "100% Subsidized Inputs for Delta Farmers",
    description:
      "Special seasonal package for Cauvery Delta farmers ensuring certified short-duration paddy seeds (ADT 43, ASD 16, TPS 5), micro-nutrient kits, bio-fertilizers (Azospirillum & Phosphobacteria), and zinc sulphate.",
    eligibility: [
      "Farmers in Thanjavur, Tiruvarur, Nagapattinam, Mayiladuthurai, Cuddalore, and Tiruchirappalli.",
      "Valid Patta/Chitta or registered tenant cultivation certificate required.",
    ],
    documents: ["Aadhaar Card", "Patta/Chitta Copy", "Bank Passbook", "Uzhavan Registration ID"],
    portalUrl: "https://agritech.tnau.ac.in",
    icon: Sprout,
    color: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  {
    id: "kalaignar-all-village",
    title: "Kalaignarin All Village Integrated Agriculture Development Programme",
    tamilTitle: "கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண் வளர்ச்சி திட்டம்",
    category: "LAND_WATER",
    categoryLabel: "Land & Water",
    agency: "Rural Development & Agriculture Dept, GoTN",
    subsidy: "Free Fallow Land Reclamation & Borewell Grants",
    description:
      "A flagship multi-year program targeting village panchayats to convert cultivable fallow lands into productive crop clusters, create community farm ponds, and install shared drip micro-irrigation systems.",
    eligibility: [
      "Panchayat village clusters selected in current phase.",
      "Small and marginal farmers owning continuous fallow patches.",
    ],
    documents: ["Village Revenue Certificate", "Land Survey Number Record", "Aadhaar"],
    portalUrl: "https://tnagrisnet.tn.gov.in",
    icon: Droplet,
    color: "border-blue-200 bg-blue-50 text-blue-800",
  },
  {
    id: "uzhavan-machinery",
    title: "Agricultural Mechanization & Custom Hiring Center Subsidy",
    tamilTitle: "வேளாண் இயந்திரமயமாக்கல் & வாடகை மைய மானியம் (உழவன் செயலி)",
    category: "MACHINERY",
    categoryLabel: "Farm Mechanization",
    agency: "Agricultural Engineering Department (AED), GoTN",
    subsidy: "40% – 50% Capital Subsidy on Farm Equipment",
    description:
      "Financial assistance for purchasing tractors, power tillers, rotavators, paddy transplanters, combine harvesters, and DGCA-certified drone sprayers. Custom Hiring Centers (CHCs) operated by FPOs receive up to 50% assistance.",
    eligibility: [
      "Small and marginal farmers (eligible for 50% subsidy).",
      "Other farmers (eligible for 40% subsidy).",
      "Farmer Producer Organisations (FPOs) and Primary Agricultural Cooperative Credit Societies (PACCS).",
    ],
    documents: ["Aadhaar", "Land Patta", "Community Certificate", "Bank Quotation for Equipment"],
    portalUrl: "https://aed.tn.gov.in",
    icon: Wrench,
    color: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    id: "pm-kisan",
    title: "PM-KISAN Samman Nidhi",
    tamilTitle: "பிரதான் மந்திரி கிசான் சம்மான் நிதி (PM-KISAN)",
    category: "DIRECT_INCOME",
    categoryLabel: "Direct Income Support",
    agency: "Ministry of Agriculture & Farmers Welfare, GoI",
    subsidy: "₹6,000 / Year Direct Bank Transfer",
    description:
      "Direct income support of ₹6,000 annually provided in three equal four-monthly installments of ₹2,000 directly to the Aadhaar-linked bank accounts of land-holding farmer families.",
    eligibility: [
      "All landholding farmer families with cultivable land in their names.",
      "e-KYC and land seeding on the PM-KISAN portal mandatory.",
    ],
    documents: ["Aadhaar Number", "Land Record (Patta)", "Bank Account with NPCI e-KYC Linked"],
    portalUrl: "https://pmkisan.gov.in",
    icon: Coins,
    color: "border-purple-200 bg-purple-50 text-purple-800",
  },
  {
    id: "pmfby-insurance",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    tamilTitle: "பயிர் காப்பீட்டுத் திட்டம் (PMFBY)",
    category: "INSURANCE",
    categoryLabel: "Crop Insurance",
    agency: "Department of Agriculture, GoTN & AIC of India",
    subsidy: "Comprehensive Crop Loss Risk Cover (Subsidized 1.5% - 2% Premium)",
    description:
      "Financial shield protecting cultivators against crop losses caused by non-preventable natural risks: unseasonal heavy rains, drought, pests, cyclones, and localized post-harvest losses.",
    eligibility: [
      "All farmers growing notified crops (Paddy, Turmeric, Banana, Sugarcane, Millets).",
      "Both loanee and non-loanee farmers eligible.",
    ],
    documents: ["Sowing Certificate from VAO", "Patta/Chitta", "Adangal Record", "Bank Passbook"],
    portalUrl: "https://pmfby.gov.in",
    icon: Umbrella,
    color: "border-teal-200 bg-teal-50 text-teal-800",
  },
  {
    id: "solar-pumpset",
    title: "Chief Minister's Standalone Solar Powered Agriculture Pumps Scheme",
    tamilTitle: "முதலமைச்சரின் சூரியசக்தி பம்புசெட் மானியத் திட்டம்",
    category: "LAND_WATER",
    categoryLabel: "Solar & Clean Energy",
    agency: "TEDA & Agricultural Engineering Department",
    subsidy: "70% State & Central Capital Subsidy",
    description:
      "Installation of standalone 5 HP, 7.5 HP, and 10 HP AC/DC solar pumpsets with solar panels for farmers with borewell/openwell water sources without existing TANGEDCO grid power connections.",
    eligibility: [
      "Farmers with verified water source without free agriculture power connection.",
      "Priority given to small, marginal, and Adi Dravidar/Tribal farmers.",
    ],
    documents: ["Patta/Chitta", "Borewell / Openwell Water Source Certificate", "TANGEDCO No-Objection"],
    portalUrl: "https://teda.in",
    icon: Sun,
    color: "border-orange-200 bg-orange-50 text-orange-800",
  },
];

export default function GovernmentSchemesPage() {
  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <Link href="/" className="hover:text-stone-900">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#24593c] font-semibold">Government Schemes</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  Tamil Nadu Agricultural Schemes &amp; Subsidies
                </h1>
                <Badge variant="verified">Official 2026 Directory</Badge>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                தமிழ்நாடு அரசு மற்றும் மத்திய அரசின் வேளாண் நலத்திட்டங்கள், மானியங்கள் மற்றும் பயிர் காப்பீட்டு வழிகாட்டி
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/intelligence/crop-advisory"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1a402a] shadow-xs"
              >
                <span>Ask AgriVoice AI About Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Agricultural Hero Section */}
        <div className="relative rounded-xl overflow-hidden my-6 h-44 sm:h-52">
          <img
            src="/images/hero/tamilnadu-farmland-hero.jpg"
            alt="Tamil Nadu green agriculture schemes and government agricultural subsidies"
            className="w-full h-full object-cover object-[center_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e4731]/95 via-[#24593c]/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <div className="max-w-2xl">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                Department of Agriculture &amp; Farmers Welfare
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 drop-shadow">
                Single-Window Government Support for Rural Cultivators
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 line-clamp-2">
                Access official subsidy guidelines, PM-KISAN verification steps, Uzhavan App machinery custom hiring schemes, and seasonal delta relief packages.
              </p>
            </div>
          </div>
        </div>

        {/* Scheme Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          {SCHEMES.map((scheme) => {
            const Icon = scheme.icon;
            return (
              <div
                key={scheme.id}
                className="agri-card p-6 bg-white flex flex-col justify-between border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all rounded-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${scheme.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                          {scheme.categoryLabel}
                        </span>
                        <h3 className="text-base font-bold text-stone-900 leading-snug">
                          {scheme.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#24593c] mt-0.5">
                          {scheme.tamilTitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-3">
                    {scheme.subsidy}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {scheme.description}
                  </p>

                  <div className="space-y-2 border-t border-stone-100 pt-3 text-xs">
                    <div>
                      <span className="font-bold text-stone-800">Implementing Agency: </span>
                      <span className="text-stone-600">{scheme.agency}</span>
                    </div>

                    <div>
                      <span className="font-bold text-stone-800">Eligibility: </span>
                      <ul className="list-disc list-inside text-stone-600 mt-0.5 space-y-0.5 pl-1">
                        {scheme.eligibility.map((el, i) => (
                          <li key={i}>{el}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-stone-800">Key Documents: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {scheme.documents.map((doc, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200"
                          >
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    <span>Official Portal Guidelines</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    href={`/dashboard/farmer`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded transition-colors"
                  >
                    <span>Check Workspace Match</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Helpful Assistance Callout */}
        <div className="p-5 rounded-xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#24593c] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                Need Help Enrolling or Verifying Revenue Patta?
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Visit your local Block Agricultural Extension Officer (ADA Office) or consult the AgriVoice AI assistant for guidance on Uzhavan App registration.
              </p>
            </div>
          </div>

          <Link
            href="/intelligence/crop-advisory"
            className="whitespace-nowrap px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1a402a] shadow-xs"
          >
            Launch AgriVoice Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
