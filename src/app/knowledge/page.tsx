import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Sprout,
  ShieldAlert,
  Droplet,
  Sun,
  Layers,
  ArrowRight,
  ExternalLink,
  Bot,
  Calculator,
  Compass,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Agronomic Knowledge Hub & TNAU Crop Protocols | AgriBridge",
  description:
    "Grounded agronomic guidelines, integrated pest management protocols, soil health standards, and harvest price intelligence for Tamil Nadu agriculture.",
};

const KNOWLEDGE_TOPICS = [
  {
    id: "paddy-ipm",
    title: "Integrated Pest Management (IPM) for Paddy Yellow Stem Borer",
    tamilTitle: "நெல் தண்டு துளைப்பான் ஒருங்கிணைந்த பூச்சி மேலாண்மை",
    category: "Pest & Disease Control",
    institution: "Tamil Nadu Agricultural University (TNAU)",
    summary:
      "Biological, cultural, and targeted chemical methods to control Scirpophaga incertulas in Kuruvai and Samba crops while minimizing ecological disruption.",
    points: [
      "Set up 5 pheromone traps per acre at 20m spacing to monitor adult moth activity.",
      "Release Trichogramma japonicum egg parasitoid cards at 2.5 cc/acre, 3 times at weekly intervals starting 37 days after transplanting.",
      "Apply Chlorantraniliprole 18.5% SC (60 ml/acre in 200L water) only if Economic Threshold Level exceeds 5% dead hearts or 1 adult moth/m².",
      "Avoid excess nitrogen application in early tillering to prevent dense lush canopy attracting adult moths.",
    ],
    badge: "TNAU Certified",
  },
  {
    id: "soil-nutrition",
    title: "Delta Basal Fertilizer & Bio-Inoculant Protocol",
    tamilTitle: "டெல்டா அடி உரமிடுதல் & உயிர் உரங்கள் மேலாண்மை",
    category: "Soil Health & Nutrients",
    institution: "Dept of Agriculture, GoTN & TNAU",
    summary:
      "Balanced macro and micro-nutrient application to prevent zinc deficiency and optimize vegetative tillering without chemical runoff.",
    points: [
      "Soil Test Based Application: Apply 10 kg Zinc Sulphate mixed with 20 kg dry sand per acre before final puddling (do not mix zinc with DAP).",
      "Bio-Fertilizer Inoculation: Seedling root dip with Azospirillum (1 kg/acre) and Phosphobacteria (1 kg/acre) diluted in 40L water for 30 minutes before transplanting.",
      "Apply well-rotted Farm Yard Manure (FYM) or composted coir pith at 5 tonnes per acre during first summer ploughing.",
      "Split nitrogen top-dressing into 3 equal doses: basal, active tillering, and panicle initiation.",
    ],
    badge: "Nutrient Protocol",
  },
  {
    id: "awd-irrigation",
    title: "Alternate Wetting and Drying (AWD) Water-Saving Method",
    tamilTitle: "மாற்று நீர் பாய்ச்சல் & உலர்த்துதல் பாசன முறை (AWD)",
    category: "Water & Irrigation",
    institution: "International Rice Research Institute (IRRI) & TNAU",
    summary:
      "A climate-smart irrigation practice reducing water consumption by 25–35% without compromising paddy yield in Cauvery Delta canal and borewell systems.",
    points: [
      "Install a perforated 30cm PVC field water pipe (Pani Pipe) with 15cm buried below the soil surface.",
      "After transplanting, maintain a shallow 2–3 cm water layer for the first 10 days to encourage seedling establishment.",
      "Thereafter, irrigate only when the water level inside the Pani Pipe drops to 15 cm below the soil surface.",
      "Keep 5 cm continuous standing water during flowering and grain filling to prevent chaffy panicles.",
    ],
    badge: "Climate Smart",
  },
  {
    id: "turmeric-curcumin",
    title: "Erode Turmeric Quality & Post-Harvest Curing Guidelines",
    tamilTitle: "மஞ்சள் வேகவைத்தல், பதப்படுத்துதல் & சந்தை தரம்",
    category: "Harvest & Processing",
    institution: "Spices Board & Regulated Market Committee, Erode",
    summary:
      "Recommended harvest maturity indicators, boiling durations, and moisture parameters to maximize curcumin content and command premium mandi prices.",
    points: [
      "Harvest only when lower leaves turn yellow and pseudostem dries completely (typically 8–9 months after planting).",
      "Steam boiling: Boil freshly dug rhizomes in clean water for 45–60 minutes until white froth appears and the core turns soft without splitting.",
      "Sun dry on clean tarpaulins for 10–15 days until moisture drops below 10% (metallic sound when finger is broken).",
      "Machine polish to remove outer skin and achieve the signature golden yellow color demanded by export buyers.",
    ],
    badge: "Export Grade",
  },
  {
    id: "direct-seeding",
    title: "Direct Seeded Rice (DSR) & Mechanized Line Sowing",
    tamilTitle: "நேரடி நெல் விதைப்பு & இயந்திர நடவு முறை",
    category: "Mechanization & Labour",
    institution: "Agricultural Engineering Dept, GoTN",
    summary:
      "Overcoming peak-season agricultural labour shortages through tractor-mounted seed drills and 8-row mechanical transplanters.",
    points: [
      "Use drum seeders on well-puddled, drained soil to maintain precise 20cm x 10cm plant geometry.",
      "Seed rate is reduced to 12–15 kg/acre compared to 30 kg in manual broadcasting.",
      "Saves up to 15–18 worker days per acre during initial nursery raising and transplanting.",
      "Pre-emergence herbicide (Pyrazosulfuron-ethyl 10% WP at 80g/acre) must be applied within 3–5 days of seeding to control early weeds.",
    ],
    badge: "Mechanization",
  },
  {
    id: "mandi-standards",
    title: "Direct Purchase Center (DPC) Paddy Acceptance Norms",
    tamilTitle: "அரசு நேரடி கொள்முதல் நிலைய நெல் கொள்முதல் விதிகள்",
    category: "Mandi & MSP Commerce",
    institution: "Tamil Nadu Civil Supplies Corporation (TNCSC)",
    summary:
      "Mandatory quality benchmarks, maximum permissible moisture percentages, and fair average quality (FAQ) standards for government MSP procurement.",
    points: [
      "Maximum permissible moisture content is 17% (grain dryer assistance available at select DPCs during unseasonal rain).",
      "Maximum tolerance for foreign matter: 1% organic and 1% inorganic.",
      "Damaged, discolored, and sprouted grains must not exceed 5% total weight.",
      "Produce payment is credited directly into farmer's bank account within 48–72 hours of weighing.",
    ],
    badge: "MSP Guidelines",
  },
];

export default function KnowledgeHubPage() {
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
            <span className="text-[#24593c] font-semibold">Knowledge Hub</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                  AgriBridge Agronomic Knowledge Hub
                </h1>
                <Badge variant="verified">TNAU &amp; ICAR Grounded</Badge>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                அறிவியல் பூர்வமான பயிர் மேலாண்மை, ஒருங்கிணைந்த பூச்சி கட்டுப்பாடு மற்றும் அறுவடை பின்சார் தொழில்நுட்பங்கள்
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/intelligence/crop-advisory"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1a402a] shadow-xs"
              >
                <Bot className="w-4 h-4" />
                <span>Consult AgriVoice AI Assistant</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Agricultural Hero Section */}
        <div className="relative rounded-xl overflow-hidden my-6 h-40 sm:h-48">
          <img
            src="/images/agribridge/01-farm-projects/green-paddy-field.jpg"
            alt="Tamil Nadu lush green agriculture research and crop production technology"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e4731]/95 via-[#24593c]/75 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
            <div className="max-w-2xl">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                Scientifically Validated Crop Standards
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 drop-shadow">
                Precision Agronomic Practices for Tamil Nadu Agro-Climatic Zones
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1 line-clamp-2">
                Curated protocols covering paddy, turmeric, banana, and millets designed to maximize yield, minimize pest infestations, and safeguard ecosystem soil health.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Intelligence Tools Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/intelligence/crop-advisory"
            className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#24593c] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">AgriVoice AI Assistant</div>
              <div className="text-[11px] text-stone-500">Tamil &amp; English interactive speech/text guidance</div>
            </div>
          </Link>

          <Link
            href="/intelligence/budget-calculator"
            className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Crop Budget Calculator</div>
              <div className="text-[11px] text-stone-500">Itemize seed, fertilizer, machinery, and labour costs</div>
            </div>
          </Link>

          <Link
            href="/intelligence/weather-risks"
            className="p-4 rounded-xl border border-stone-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Weather Risk Advisory</div>
              <div className="text-[11px] text-stone-500">Monsoon forecast, cyclone alerts &amp; crop mitigation</div>
            </div>
          </Link>
        </div>

        {/* Knowledge Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {KNOWLEDGE_TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="agri-card p-6 bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all rounded-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {topic.category}
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400">
                    {topic.institution}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-xs font-semibold text-[#24593c] mt-0.5">
                  {topic.tamilTitle}
                </p>

                <p className="text-xs text-stone-600 mt-2 mb-4 leading-relaxed">
                  {topic.summary}
                </p>

                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider">
                    Core Technical Protocol:
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-600 pl-1">
                    {topic.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#24593c] mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  Ref: TNAU Agritech Portal Standards
                </span>
                <Link
                  href="/intelligence/crop-advisory"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#24593c] hover:underline"
                >
                  <span>Ask Questions in Tamil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
