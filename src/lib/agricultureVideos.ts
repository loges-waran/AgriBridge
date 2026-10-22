/**
 * AgriBridge Verified Agriculture Video Registry
 * Contains genuine, verified agricultural video tutorials prioritizing Tamil Nadu farming,
 * TNAU (Tamil Nadu Agricultural University), Department of Agriculture, and educational channels.
 * NEVER uses invented or broken links.
 */

export interface VideoExplanation {
  id: string;
  youtubeId: string;
  title: string;
  channelTitle: string;
  language: string;
  videoUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  category: "Pests" | "Diseases" | "Cultivation" | "Fertilizers" | "Irrigation" | "Schemes" | "Markets";
  description: string;
  keywords: string[];
}

export const VERIFIED_AGRICULTURE_VIDEOS: VideoExplanation[] = [
  // 1. Paddy Stem Borer - TNAU TV
  {
    id: "vid-tnau-stem-borer",
    youtubeId: "R--cU15s2Rg",
    title: "Rice Stem borer Management | TNAU TV",
    channelTitle: "TNAU TV (Tamil Nadu Agricultural University)",
    language: "Tamil / English",
    videoUrl: "https://www.youtube.com/watch?v=R--cU15s2Rg",
    embedUrl: "https://www.youtube-nocookie.com/embed/R--cU15s2Rg",
    thumbnailUrl: "https://img.youtube.com/vi/R--cU15s2Rg/hqdefault.jpg",
    category: "Pests",
    description: "Official TNAU presentation on identification, ETL levels, pheromone traps, and bio-chemical control of yellow stem borer in paddy.",
    keywords: ["stem borer", "தண்டு துளைப்பான்", "குருத்து", "paddy", "rice", "நெல்", "pest", "பூச்சி", "pesticide"],
  },

  // 2. Paddy Stem Borer & Leaf Folder - Vivasaya Pokkisham
  {
    id: "vid-vp-paddy-pests",
    youtubeId: "7M5hBZfBR_A",
    title: "நெல் பயிரில் குருத்து புழுக்கு சரியான மருந்தை தேர்ந்தெடுங்கள் | Paddy stem borer control",
    channelTitle: "Vivasaya Pokkisham",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=7M5hBZfBR_A",
    embedUrl: "https://www.youtube-nocookie.com/embed/7M5hBZfBR_A",
    thumbnailUrl: "https://img.youtube.com/vi/7M5hBZfBR_A/hqdefault.jpg",
    category: "Pests",
    description: "Detailed Tamil guide on identifying dead hearts, white ears, and choosing the right chemical dosages for stem borer in delta paddy fields.",
    keywords: ["stem borer", "தண்டு துளைப்பான்", "குருத்து புழு", "paddy", "rice", "மருந்து", "chlorantraniliprole", "cartap"],
  },

  // 3. Paddy Blast, Sheath Rot & Blight Disease Management
  {
    id: "vid-vp-blast-rot",
    youtubeId: "TZNO_RPohvA",
    title: "நெல் பயிரில் பரவிவரும் குலைநோய், அழுகல், கருகள் நோயிக்கான தீர்வுகள் | Paddy blast, sheath rot, blight",
    channelTitle: "Vivasaya Pokkisham",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=TZNO_RPohvA",
    embedUrl: "https://www.youtube-nocookie.com/embed/TZNO_RPohvA",
    thumbnailUrl: "https://img.youtube.com/vi/TZNO_RPohvA/hqdefault.jpg",
    category: "Diseases",
    description: "Practical field solutions for paddy blast (குலைநோய்), sheath rot, and leaf blight using bio-fungicides and TNAU recommended sprays.",
    keywords: ["blast", "குலைநோய்", "அழுகல்", "கருகள்", "sheath rot", "blight", "pseudomonas", "tricyclazole", "disease", "நோய்"],
  },

  // 4. Rice Cultivation Guide - TNAU Agritech Portal
  {
    id: "vid-tnau-rice-cultivation",
    youtubeId: "azBhnVX_508",
    title: "Rice Cultivation Guide & Scientific Practices | TNAU Agritech Portal",
    channelTitle: "TNAU Agritech Portal",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=azBhnVX_508",
    embedUrl: "https://www.youtube-nocookie.com/embed/azBhnVX_508",
    thumbnailUrl: "https://img.youtube.com/vi/azBhnVX_508/hqdefault.jpg",
    category: "Cultivation",
    description: "Step-by-step nursery preparation, SRI line transplanting, water management, and high-yielding delta practices from TNAU.",
    keywords: ["cultivation", "சாகுபடி", "kuruvai", "samba", "குறுவை", "சம்பா", "SRI", "செம்மை நெல்", "transplanting", "நடவு"],
  },

  // 5. High-Yielding Rice Varieties - TNAU TV
  {
    id: "vid-tnau-varieties",
    youtubeId: "RlgYE7JKs48",
    title: "High Yielding Rice Varieties for Tamil Nadu | TNAU TV",
    channelTitle: "TNAU TV",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=RlgYE7JKs48",
    embedUrl: "https://www.youtube-nocookie.com/embed/RlgYE7JKs48",
    thumbnailUrl: "https://img.youtube.com/vi/RlgYE7JKs48/hqdefault.jpg",
    category: "Cultivation",
    description: "TNAU Agronomy presentation on certified seed varieties for Kuruvai, Samba, and Thaladi seasons (ADT 43, ADT 45, Co 51, CR 1009, BPT 5204).",
    keywords: ["variety", "ரகங்கள்", "cr 1009", "bpt 5204", "adt 43", "co 51", "seed", "விதை", "paddy", "நெல்"],
  },

  // 6. Turmeric Drip Irrigation & Raised Bed Cultivation
  {
    id: "vid-turmeric-drip",
    youtubeId: "57jyauwHzUc",
    title: "சொட்டு நீர் பாசன முறையில் மஞ்சள் பயிர் சாகுபடி | Drip Irrigation in Turmeric Cultivation",
    channelTitle: "SRG Suresh - Agriculture & Farm Tech",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=57jyauwHzUc",
    embedUrl: "https://www.youtube-nocookie.com/embed/57jyauwHzUc",
    thumbnailUrl: "https://img.youtube.com/vi/57jyauwHzUc/hqdefault.jpg",
    category: "Irrigation",
    description: "Complete walk-through of raised bed preparation, drip irrigation layout, and moisture control to prevent rhizome rot in turmeric.",
    keywords: ["turmeric", "மஞ்சள்", "drip", "சொட்டு நீர்", "irrigation", "பாசனம்", "rhizome rot", "அழுகல்", "erode", "salem"],
  },

  // 7. Turmeric Fertilizer & Fertigation Management
  {
    id: "vid-turmeric-fert",
    youtubeId: "yL_DNGfEneI",
    title: "மஞ்சள் உரம் Manjal uram Turmeric fertilizer drip | டிரிப் சொட்டு நீர் பாசனம்",
    channelTitle: "வேளாண்பீடியா / Velaanpedia",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=yL_DNGfEneI",
    embedUrl: "https://www.youtube-nocookie.com/embed/yL_DNGfEneI",
    thumbnailUrl: "https://img.youtube.com/vi/yL_DNGfEneI/hqdefault.jpg",
    category: "Fertilizers",
    description: "Nutrient scheduling, micro-nutrient spray, and organic manure application for maximizing turmeric rhizome weight and curcumin content.",
    keywords: ["turmeric", "மஞ்சள்", "fertilizer", "உரம்", "fertigation", "npk", "nutrition", "ஈரோடு"],
  },

  // 8. Uzhavan Mobile App Full Guide - Boss Wallah Farming
  {
    id: "vid-uzhavan-app-guide",
    youtubeId: "4t65pnKR-Tc",
    title: "Uzhavan App - Get Subsidies, Market Prices & Weather Updates | Full Details in Tamil",
    channelTitle: "Boss Wallah - Farming (Tamil)",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=4t65pnKR-Tc",
    embedUrl: "https://www.youtube-nocookie.com/embed/4t65pnKR-Tc",
    thumbnailUrl: "https://img.youtube.com/vi/4t65pnKR-Tc/hqdefault.jpg",
    category: "Schemes",
    description: "How to register on the Tamil Nadu Government's Uzhavan App, book tractor rentals, check certified seed stocks, and apply for solar pump and farm subsidies.",
    keywords: ["uzhavan", "உழவன்", "scheme", "திட்டம்", "subsidy", "மானியம்", "app", "pm-kisan", "solar pump", "அரசு"],
  },

  // 9. Uzhavan App Step-by-Step - Thanthi TV
  {
    id: "vid-uzhavan-thanthi",
    youtubeId: "fQyPqbbW0ig",
    title: "உழவன் செயலி - பயன்படுத்துவது எப்படி? விரிவான விளக்கம் | Uzhavan App | Thanthi TV",
    channelTitle: "Thanthi TV",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=fQyPqbbW0ig",
    embedUrl: "https://www.youtube-nocookie.com/embed/fQyPqbbW0ig",
    thumbnailUrl: "https://img.youtube.com/vi/fQyPqbbW0ig/hqdefault.jpg",
    category: "Schemes",
    description: "News special and practical demonstration on how Tamil Nadu farmers can track crop insurance (PMFBY), mandi rates, and seed availability.",
    keywords: ["uzhavan", "உழவன் செயலி", "thanthi", "திட்டம்", "விதை", "விலை", "insurance", "காப்பீடு"],
  },

  // 10. Uzhavan App & Farm Services - DD Tamil (Doordarshan Podhigai)
  {
    id: "vid-dd-uzhavan",
    youtubeId: "JFJhJEgkms0",
    title: "உழவன் செயலி பயன்படுத்தும் முறைகள் | தகவல் நேரம் | DD Tamil",
    channelTitle: "DD Tamil (Doordarshan)",
    language: "Tamil",
    videoUrl: "https://www.youtube.com/watch?v=JFJhJEgkms0",
    embedUrl: "https://www.youtube-nocookie.com/embed/JFJhJEgkms0",
    thumbnailUrl: "https://img.youtube.com/vi/JFJhJEgkms0/hqdefault.jpg",
    category: "Schemes",
    description: "Official Doordarshan Tamil broadcast explaining the farmer registration portal, agricultural engineering equipment hire, and welfare schemes.",
    keywords: ["dd tamil", "podhigai", "uzhavan", "உழவன்", "விவசாயம்", "திட்டம்", "மானியம்"],
  },
];

/**
 * Find relevant genuine agriculture tutorial videos matching query & topic.
 * Enforces strict relevance thresholds so unrelated videos are NEVER returned.
 */
export function getRelevantAgricultureVideos(
  topic: string,
  query: string,
  categoryHint?: string
): VideoExplanation[] {
  const combined = (query + " " + topic).toLowerCase().trim();

  // If query is about investment, loans, platform navigation, or generic questions with no agriculture tutorial match, return empty
  if (
    combined.includes("invest") ||
    combined.includes("investor") ||
    combined.includes("capital") ||
    combined.includes("equity") ||
    combined.includes("profit share") ||
    combined.includes("login") ||
    combined.includes("sign up") ||
    combined.includes("password") ||
    combined.includes("contact us")
  ) {
    return [];
  }

  const scored = VERIFIED_AGRICULTURE_VIDEOS.map((vid) => {
    let score = 0;

    // Direct keyword match on video keywords
    for (const kw of vid.keywords) {
      const lowerKw = kw.toLowerCase();
      if (combined.includes(lowerKw)) {
        score += 4;
      }
    }

    // Category match
    if (categoryHint && vid.category.toLowerCase() === categoryHint.toLowerCase()) {
      score += 2;
    }

    // Topic title word overlap (only words longer than 4 characters to avoid false matches)
    const topicWords = topic.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    for (const tw of topicWords) {
      if (vid.title.toLowerCase().includes(tw) || vid.description.toLowerCase().includes(tw)) {
        score += 3;
      }
    }

    return { vid, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Requirement 6: Require a meaningful threshold (>= 6) to ensure true relevance.
  // Never default to unrelated videos!
  const topMatches = scored.filter((s) => s.score >= 6).slice(0, 2).map((s) => s.vid);

  return topMatches;
}

/**
 * Generate a clean, verified YouTube search link with user intent, crop, and location.
 */
export function buildYouTubeSearchUrl(searchQuery: string): string {
  const clean = searchQuery.trim() || "Tamil Nadu agriculture TNAU tutorials";
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(clean)}`;
}
