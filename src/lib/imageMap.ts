/**
 * AgriBridge Image Mapping Utility
 * Maps crop types, machinery categories, and resource types to both local assets
 * (/images/...) and verified fallback URLs.
 */

export type CropKey =
  | "Paddy"
  | "Turmeric"
  | "Banana"
  | "Organic"
  | "Sugarcane"
  | "Cotton"
  | "Groundnut"
  | "Maize"
  | "Vegetables"
  | "default";

export type MachineryKey =
  | "TRACTOR"
  | "HARVESTER"
  | "DRONE"
  | "TILLER"
  | "PUMP"
  | "LASER_LEVELER"
  | "ROTAVATOR"
  | "default";

export type InputKey =
  | "SEED"
  | "FERTILIZER"
  | "ORGANIC_PESTICIDE"
  | "IRRIGATION"
  | "TOOL"
  | "default";

export type ResourceKey =
  | "labour"
  | "machinery"
  | "inputs"
  | "seeds"
  | "fertilizer"
  | "pesticide"
  | "irrigation"
  | "transport"
  | "land"
  | "investment"
  | "buyer"
  | "produce"
  | "default";

export interface ImageAsset {
  src: string;
  fallback: string;
  alt: string;
}

// Crop images
export const CROP_IMAGES: Record<CropKey, ImageAsset> = {
  Paddy: {
    src: "/images/agribridge/01-farm-projects/green-paddy-field.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Lush green paddy rice fields in Tamil Nadu (Kuruvai / Samba)",
  },
  Turmeric: {
    src: "/images/crops/turmeric.jpg",
    fallback: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&q=80",
    alt: "Fresh turmeric rhizomes and foliage (Erode / Salem variety)",
  },
  Banana: {
    src: "/images/crops/banana.jpg",
    fallback: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80",
    alt: "Banana plantation in Cauvery river delta",
  },
  Organic: {
    src: "/images/crops/organic.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Certified organic vegetable and pulse farm",
  },
  Sugarcane: {
    src: "/images/crops/sugarcane.jpg",
    fallback: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Sugarcane field cultivation in South India",
  },
  Cotton: {
    src: "/images/crops/cotton.jpg",
    fallback: "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?w=800&q=80",
    alt: "Cotton crop bolls ready for picking",
  },
  Groundnut: {
    src: "/images/crops/groundnut.jpg",
    fallback: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    alt: "Groundnut legume crop in red loamy soil",
  },
  Maize: {
    src: "/images/crops/maize.jpg",
    fallback: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
    alt: "Maize corn field with healthy cobs",
  },
  Vegetables: {
    src: "/images/crops/vegetables.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Colourful_vegetables.jpg",
    alt: "Colourful fresh Indian farm vegetables (brinjal, okra, tomatoes, gourds)",
  },
  default: {
    src: "/images/crops/default-crop.jpg",
    fallback: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    alt: "Agricultural farmland in Tamil Nadu",
  },
};

// Machinery images
export const MACHINERY_IMAGES: Record<MachineryKey, ImageAsset> = {
  TRACTOR: {
    src: "/images/machinery/tractor.jpg",
    fallback: "https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80",
    alt: "Heavy 4WD agricultural tractor ploughing field",
  },
  HARVESTER: {
    src: "/images/machinery/harvester.jpg",
    fallback: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80",
    alt: "Combine harvester cutting and threshing paddy",
  },
  DRONE: {
    src: "/images/machinery/drone.jpg",
    fallback: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80",
    alt: "Autonomous agri-drone for aerial bio-spray",
  },
  TILLER: {
    src: "/images/machinery/tiller.jpg",
    fallback: "https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=800&q=80",
    alt: "Power tiller puddle cultivator in wetland",
  },
  PUMP: {
    src: "/images/machinery/pump.jpg",
    fallback: "https://images.unsplash.com/photo-1558618047-f4fd3f39e886?w=800&q=80",
    alt: "Solar farm water pump and tube-well setup",
  },
  LASER_LEVELER: {
    src: "/images/machinery/rotavator.jpg",
    fallback: "https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80",
    alt: "Precision laser land leveler equipment",
  },
  ROTAVATOR: {
    src: "/images/machinery/rotavator.jpg",
    fallback: "https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80",
    alt: "Tractor mounted rotary tiller rotavator",
  },
  default: {
    src: "/images/machinery/default-machinery.jpg",
    fallback: "https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80",
    alt: "Agricultural mechanization implement",
  },
};

// Input products images
export const INPUT_IMAGES: Record<InputKey, ImageAsset> = {
  SEED: {
    src: "/images/resources/seeds.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Certified high-germination foundation seeds",
  },
  FERTILIZER: {
    src: "/images/resources/fertilizer.jpg",
    fallback: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    alt: "Bio-NPK organic compost and microbial bio-fertilizers",
  },
  ORGANIC_PESTICIDE: {
    src: "/images/resources/pesticide.jpg",
    fallback: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&q=80",
    alt: "Cold-pressed neem bio-pesticide and botanical defense spray",
  },
  IRRIGATION: {
    src: "/images/resources/irrigation.jpg",
    fallback: "https://images.unsplash.com/photo-1558618047-f4fd3f39e886?w=800&q=80",
    alt: "Drip irrigation tubing, emitters and micro-sprinklers",
  },
  TOOL: {
    src: "/images/resources/fertilizer.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Certified farming implements and tools",
  },
  default: {
    src: "/images/resources/fertilizer.jpg",
    fallback: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    alt: "Agricultural certified input package",
  },
};

// Resource Gap categories & marketplace representations
export const RESOURCE_IMAGES: Record<ResourceKey, ImageAsset> = {
  labour: {
    src: "/images/agribridge/01-farm-projects/rice-field-workers.jpg",
    fallback: "https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=800&q=80",
    alt: "Agricultural labour gang crew transplanting and tending paddy fields",
  },
  machinery: {
    src: "/images/machinery/tractor.jpg",
    fallback: "https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80",
    alt: "Farm machinery equipment and rental fleet",
  },
  inputs: {
    src: "/images/resources/fertilizer.jpg",
    fallback: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    alt: "Agri inputs, organic bio-nutrients and inputs",
  },
  seeds: {
    src: "/images/resources/seeds.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Certified paddy and crop seeds",
  },
  fertilizer: {
    src: "/images/resources/fertilizer.jpg",
    fallback: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    alt: "Bio-fertilizers and organic soil conditioners",
  },
  pesticide: {
    src: "/images/resources/pesticide.jpg",
    fallback: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&q=80",
    alt: "Organic biological pest control formulations",
  },
  irrigation: {
    src: "/images/resources/irrigation.jpg",
    fallback: "https://images.unsplash.com/photo-1558618047-f4fd3f39e886?w=800&q=80",
    alt: "Modern drip and sprinkler irrigation installations",
  },
  transport: {
    src: "/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/1/17/Bullock_Cart_and_Driver_-_Kumbakonam_-_India.JPG",
    alt: "Agricultural transport and harvest haulage in Tamil Nadu",
  },
  land: {
    src: "/images/agribridge/01-farm-projects/monsoon-ploughing.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Fertile agricultural land parcel with water access and monsoon ploughing",
  },
  investment: {
    src: "/images/agribridge/02-funding-and-investment/farmer-funding-growth.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Farmer working capital funding and agricultural growth",
  },
  buyer: {
    src: "/images/agribridge/01-farm-projects/farmer-selling-produce.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/3/3c/A_Vegetable_Vendor_at_Chengalpet_Market_-_Happy_Madras_Week%21%21%21_%2814801208708%29.jpg",
    alt: "Farmer selling fresh harvest directly to wholesale buyers and Mandi aggregators",
  },
  produce: {
    src: "/images/resources/produce.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Koyambedu_Market.jpg",
    alt: "Wholesale agricultural mandi produce auction in Tamil Nadu",
  },
  default: {
    src: "/images/fallback.jpg",
    fallback: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    alt: "Agricultural resource fulfillment asset",
  },
};

// Hero banners
export const HERO_IMAGES = {
  dashboard: {
    src: "/images/hero/dashboard-hero.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    alt: "Panoramic landscape of Tamil Nadu agriculture and fertile fields",
  },
  advisory: {
    src: "/images/hero/advisory-hero.jpg",
    fallback: "https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=1400&q=80",
    alt: "Tamil Nadu farmers inspecting healthy paddy fields with scientific advisory",
  },
  machinery: {
    src: "/images/machinery/tractor.jpg",
    fallback: "https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=1400&q=80",
    alt: "Modern farm tractors and machinery in Tamil Nadu",
  },
  projects: {
    src: "/images/crops/paddy.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80",
    alt: "Coordinated cultivation projects across Tamil Nadu",
  },
  produce: {
    src: "/images/resources/produce.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80",
    alt: "Fresh harvest and wholesale produce trading",
  },
  inputs: {
    src: "/images/resources/fertilizer.jpg",
    fallback: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80",
    alt: "Certified biological agri-inputs and quality seeds",
  },
};

/**
 * Get crop image based on crop name string (case-insensitive partial match)
 */
export function getCropImage(cropName?: string | null): ImageAsset {
  if (!cropName) return CROP_IMAGES["default"];
  const lower = cropName.toLowerCase();
  if (lower.includes("paddy") || lower.includes("rice") || lower.includes("kuruvai") || lower.includes("samba"))
    return CROP_IMAGES["Paddy"];
  if (lower.includes("turmeric") || lower.includes("manjal"))
    return CROP_IMAGES["Turmeric"];
  if (lower.includes("banana") || lower.includes("vazhai"))
    return CROP_IMAGES["Banana"];
  if (lower.includes("organic") || lower.includes("iyarkai"))
    return CROP_IMAGES["Organic"];
  if (lower.includes("sugarcane") || lower.includes("karumbu"))
    return CROP_IMAGES["Sugarcane"];
  if (lower.includes("cotton") || lower.includes("paruthi"))
    return CROP_IMAGES["Cotton"];
  if (lower.includes("groundnut") || lower.includes("peanut") || lower.includes("kadalai"))
    return CROP_IMAGES["Groundnut"];
  if (lower.includes("maize") || lower.includes("corn") || lower.includes("makka"))
    return CROP_IMAGES["Maize"];
  if (
    lower.includes("vegetable") ||
    lower.includes("tomato") ||
    lower.includes("onion") ||
    lower.includes("brinjal") ||
    lower.includes("chilli")
  )
    return CROP_IMAGES["Vegetables"];
  return CROP_IMAGES["default"];
}

/**
 * Get machinery image based on category key
 */
export function getMachineryImage(category?: string | null): ImageAsset {
  if (!category) return MACHINERY_IMAGES["default"];
  const upper = category.toUpperCase();
  if (upper.includes("TRACTOR")) return MACHINERY_IMAGES["TRACTOR"];
  if (upper.includes("HARVESTER")) return MACHINERY_IMAGES["HARVESTER"];
  if (upper.includes("DRONE")) return MACHINERY_IMAGES["DRONE"];
  if (upper.includes("TILLER")) return MACHINERY_IMAGES["TILLER"];
  if (upper.includes("PUMP")) return MACHINERY_IMAGES["PUMP"];
  if (upper.includes("LEVELER") || upper.includes("LASER")) return MACHINERY_IMAGES["LASER_LEVELER"];
  if (upper.includes("ROTAVATOR")) return MACHINERY_IMAGES["ROTAVATOR"];
  return MACHINERY_IMAGES["default"];
}

/**
 * Get input product image based on category key
 */
export function getInputImage(category?: string | null): ImageAsset {
  if (!category) return INPUT_IMAGES["default"];
  const upper = category.toUpperCase();
  if (upper.includes("SEED")) return INPUT_IMAGES["SEED"];
  if (upper.includes("FERTILIZER")) return INPUT_IMAGES["FERTILIZER"];
  if (upper.includes("PESTICIDE")) return INPUT_IMAGES["ORGANIC_PESTICIDE"];
  if (upper.includes("IRRIGATION")) return INPUT_IMAGES["IRRIGATION"];
  if (upper.includes("TOOL")) return INPUT_IMAGES["TOOL"];
  return INPUT_IMAGES["default"];
}

/**
 * Get resource thumbnail image based on category string
 */
export function getResourceImage(category?: string | null): ImageAsset {
  if (!category) return RESOURCE_IMAGES["default"];
  const lower = category.toLowerCase();
  if (lower.includes("labour") || lower.includes("gang") || lower.includes("worker"))
    return RESOURCE_IMAGES["labour"];
  if (lower.includes("machin") || lower.includes("tractor") || lower.includes("drone") || lower.includes("equipment"))
    return RESOURCE_IMAGES["machinery"];
  if (lower.includes("seed")) return RESOURCE_IMAGES["seeds"];
  if (lower.includes("fertiliz") || lower.includes("compost") || lower.includes("manure"))
    return RESOURCE_IMAGES["fertilizer"];
  if (lower.includes("pesticid") || lower.includes("bio-defense") || lower.includes("neem"))
    return RESOURCE_IMAGES["pesticide"];
  if (lower.includes("irrigation") || lower.includes("drip") || lower.includes("water") || lower.includes("pump"))
    return RESOURCE_IMAGES["irrigation"];
  if (lower.includes("transport") || lower.includes("logistics") || lower.includes("haulage") || lower.includes("truck"))
    return RESOURCE_IMAGES["transport"];
  if (lower.includes("land") || lower.includes("lease") || lower.includes("parcel"))
    return RESOURCE_IMAGES["land"];
  if (lower.includes("invest") || lower.includes("fund") || lower.includes("capital"))
    return RESOURCE_IMAGES["investment"];
  if (lower.includes("buyer") || lower.includes("mandi") || lower.includes("trader"))
    return RESOURCE_IMAGES["buyer"];
  if (lower.includes("produce") || lower.includes("harvest") || lower.includes("crop"))
    return RESOURCE_IMAGES["produce"];
  if (lower.includes("input")) return RESOURCE_IMAGES["inputs"];
  return RESOURCE_IMAGES["default"];
}

/**
 * 01 - Farm Projects & Cultivation Assets
 */
export const FARM_PROJECT_IMAGES = {
  greenPaddyField: {
    src: "/images/agribridge/01-farm-projects/green-paddy-field.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Vibrant green paddy fields in Tamil Nadu Cauvery delta",
  },
  paddyTransplanting: {
    src: "/images/agribridge/01-farm-projects/paddy-transplanting.jpg",
    fallback: "https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=800&q=80",
    alt: "Paddy seedling transplanting in wetland fields",
  },
  plantingSeedlings: {
    src: "/images/agribridge/01-farm-projects/planting-seedlings.jpg",
    fallback: "https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=800&q=80",
    alt: "Crop cultivation and planting seedlings",
  },
  riceFieldWorkers: {
    src: "/images/agribridge/01-farm-projects/rice-field-workers.jpg",
    fallback: "https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=800&q=80",
    alt: "Agricultural workers and farm labour gang in rice field",
  },
  carryingSeedlings: {
    src: "/images/agribridge/01-farm-projects/carrying-rice-seedlings.jpg",
    fallback: "https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=800&q=80",
    alt: "Farmer carrying fresh paddy seedlings",
  },
  monsoonPloughing: {
    src: "/images/agribridge/01-farm-projects/monsoon-ploughing.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Land preparation and monsoon ploughing in wetland",
  },
  traditionalOxPloughing: {
    src: "/images/agribridge/01-farm-projects/traditional-ox-ploughing.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Traditional farming and ox-drawn ploughing in Tamil Nadu",
  },
  farmerWithCattle: {
    src: "/images/agribridge/01-farm-projects/farmer-with-cattle.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Tamil Nadu farmer with livestock cattle",
  },
  traditionalSilhouette: {
    src: "/images/agribridge/01-farm-projects/traditional-farming-silhouette.jpg",
    fallback: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    alt: "Traditional agriculture farming silhouette at sunrise",
  },
  parambuFieldPrep: {
    src: "/images/agribridge/01-farm-projects/parambu-field-preparation.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/8/8a/A_agricultural_worker_works_with_Parambu_to_prepare_the_field_for_Paddy_plantation.jpg",
    alt: "Agricultural worker using traditional Parambu leveller to prepare paddy wetland in Tamil Nadu",
  },
  tamilnaduFarmer: {
    src: "/images/agribridge/01-farm-projects/tamilnadu-farmer.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/6/63/A_Farmer_in_Tamil_Nadu.JPG",
    alt: "Authentic farmer in Tamil Nadu paddy farm",
  },
  mandiWholesaleMarket: {
    src: "/images/resources/produce.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Koyambedu_Market.jpg",
    alt: "Wholesale agricultural produce mandi auction in Tamil Nadu",
  },
  farmerSellingProduce: {
    src: "/images/agribridge/01-farm-projects/farmer-selling-produce.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/3/3c/A_Vegetable_Vendor_at_Chengalpet_Market_-_Happy_Madras_Week%21%21%21_%2814801208708%29.jpg",
    alt: "Farmer selling fresh harvest directly at vegetable market in Tamil Nadu",
  },
  kumbakonamHaulage: {
    src: "/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg",
    fallback: "https://upload.wikimedia.org/wikipedia/commons/1/17/Bullock_Cart_and_Driver_-_Kumbakonam_-_India.JPG",
    alt: "Rural agricultural freight transport in Kumbakonam Cauvery Delta",
  },
};

/**
 * 02 - Funding, Investment & Financial Analytics Assets
 */
export const FUNDING_AND_INVESTMENT_IMAGES = {
  farmerFundingGrowth: {
    src: "/images/agribridge/02-funding-and-investment/farmer-funding-growth.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Farmer funding growth and working capital development",
  },
  greenInvestmentGrowth: {
    src: "/images/agribridge/02-funding-and-investment/green-investment-growth.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Green investment growth in regenerative agriculture",
  },
  sustainableInvestmentGrowth: {
    src: "/images/agribridge/02-funding-and-investment/sustainable-investment-growth.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Sustainability and carbon credits in organic farming",
  },
  businessGrowth: {
    src: "/images/agribridge/02-funding-and-investment/business-growth.jpg",
    fallback: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    alt: "Agri-business and financial performance analytics",
  },
  investmentMarketGrowth: {
    src: "/images/agribridge/02-funding-and-investment/investment-market-growth.jpg",
    fallback: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    alt: "Agricultural investment market growth and trends",
  },
  investmentPlanning: {
    src: "/images/agribridge/02-funding-and-investment/investment-planning.jpg",
    fallback: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    alt: "Savings and farm project investment planning",
  },
  investmentSavingsJar: {
    src: "/images/agribridge/02-funding-and-investment/investment-savings-jar.jpg",
    fallback: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
    alt: "Farmer savings and disciplined investment accumulation",
  },
  investmentGrowthIllustration: {
    src: "/images/agribridge/02-funding-and-investment/investment-growth-illustration.jpg",
    fallback: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    alt: "Investment growth and financial capital illustration",
  },
};

/**
 * Returns suitable Paddy project image (rotating deterministically across 6 authentic paddy cultivation images to avoid duplicates)
 */
export function getPaddyProjectImage(indexOrId: number | string = 0): ImageAsset {
  const hash = typeof indexOrId === "number" ? Math.abs(indexOrId) : indexOrId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const paddyCycle: ImageAsset[] = [
    FARM_PROJECT_IMAGES.greenPaddyField,
    FARM_PROJECT_IMAGES.paddyTransplanting,
    FARM_PROJECT_IMAGES.plantingSeedlings,
    FARM_PROJECT_IMAGES.riceFieldWorkers,
    FARM_PROJECT_IMAGES.parambuFieldPrep,
    FARM_PROJECT_IMAGES.carryingSeedlings,
  ];
  return paddyCycle[hash % paddyCycle.length];
}

/**
 * Helper to get project card image taking into account crop name and project index
 */
export function getProjectCardImage(cropName?: string | null, indexOrId: number | string = 0): ImageAsset {
  if (!cropName) {
    const defaultCycle = [
      CROP_IMAGES.Paddy,
      CROP_IMAGES.Turmeric,
      CROP_IMAGES.Banana,
      CROP_IMAGES.Vegetables,
      CROP_IMAGES.Organic,
    ];
    const hash = typeof indexOrId === "number" ? Math.abs(indexOrId) : indexOrId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return defaultCycle[hash % defaultCycle.length];
  }
  const lower = cropName.toLowerCase();
  if (lower.includes("paddy") || lower.includes("rice") || lower.includes("kuruvai") || lower.includes("samba")) {
    return getPaddyProjectImage(indexOrId);
  }
  return getCropImage(cropName);
}

/**
 * Returns suitable Labour Job thumbnail rotating across authentic field activities
 */
export function getLabourJobImage(indexOrId: number | string = 0): ImageAsset {
  const hash = typeof indexOrId === "number" ? Math.abs(indexOrId) : indexOrId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const jobCycle: ImageAsset[] = [
    FARM_PROJECT_IMAGES.plantingSeedlings,
    FARM_PROJECT_IMAGES.paddyTransplanting,
    FARM_PROJECT_IMAGES.parambuFieldPrep,
    FARM_PROJECT_IMAGES.riceFieldWorkers,
    FARM_PROJECT_IMAGES.carryingSeedlings,
    FARM_PROJECT_IMAGES.monsoonPloughing,
  ];
  return jobCycle[hash % jobCycle.length];
}

/**
 * Returns suitable Worker Crew / Farm Hand avatar image
 */
export function getWorkerCrewImage(indexOrId: number | string = 0): ImageAsset {
  const hash = typeof indexOrId === "number" ? Math.abs(indexOrId) : indexOrId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const crewCycle: ImageAsset[] = [
    FARM_PROJECT_IMAGES.riceFieldWorkers,
    FARM_PROJECT_IMAGES.tamilnaduFarmer,
    FARM_PROJECT_IMAGES.parambuFieldPrep,
    FARM_PROJECT_IMAGES.carryingSeedlings,
    FARM_PROJECT_IMAGES.farmerWithCattle,
  ];
  return crewCycle[hash % crewCycle.length];
}

