import { Locale } from "@/lib/i18n/translations";

export const EXACT_BCP47_TAGS: Record<Locale, string> = {
  ta: "ta-IN",
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
};

/**
 * Normalizes text for text-to-speech engines in the chosen language.
 * Expands measurement units, percentages, currency, and agricultural abbreviations
 * into their localized phonetic equivalents so the TTS engine stays locked in the target language.
 */
export function normalizeTextForSpeech(text: string, locale: Locale): string {
  if (!text) return "";

  let clean = text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/#{1,6}\s+/g, "") // Headings
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/[-*•]\s+/g, " ") // Bullets
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) return "";

  if (locale === "ta") {
    clean = clean
      .replace(/(\d+)\s*%/g, "$1 சதவீதம்")
      .replace(/%/g, " சதவீதம்")
      .replace(/(\d+)\s*(?:kg|கிலோ)\.?/gi, "$1 கிலோ")
      .replace(/(\d+)\s*(?:ml|மில்லி)\.?/gi, "$1 மில்லிலிட்டர்")
      .replace(/(\d+)\s*(?:g|கிராம்)\.?/gi, "$1 கிராம்")
      .replace(/(\d+)\s*(?:ac|acre|acres)\.?/gi, "$1 ஏக்கர்")
      .replace(/(\d+)\s*(?:ha|hectare|hectares)\.?/gi, "$1 ஹெக்டேர்")
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, "$1 ரூபாய்")
      .replace(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, "$1 ரூபாய்")
      .replace(/\bTNAU\b/g, "தமிழ்நாடு வேளாண் பல்கலைக்கழகம்")
      .replace(/\bICAR\b/g, "ஐ.சி.ஏ.ஆர்")
      .replace(/\bIPM\b/g, "ஒருங்கிணைந்த பூச்சி மேலாண்மை")
      .replace(/\bDAP\b/g, "டி.ஏ.பி")
      .replace(/\bNPK\b/g, "என்.பி.கே")
      .replace(/\bSC\b/g, "எஸ்.சி")
      .replace(/\bSP\b/g, "எஸ்.பி")
      .replace(/\bWP\b/g, "டபிள்யூ.பி")
      .replace(/\bEC\b/g, "இ.சி")
      .replace(/\bPM-?KISAN\b/gi, "பி.எம் கிசான்")
      .replace(/\bPMFBY\b/g, "பயிர் காப்பீடு திட்டம்")
      .replace(/\bETL\b/g, "பொருளாதார சேத நிலை");
  } else if (locale === "hi") {
    clean = clean
      .replace(/(\d+)\s*%/g, "$1 प्रतिशत")
      .replace(/%/g, " प्रतिशत")
      .replace(/(\d+)\s*kg\.?/gi, "$1 किलो")
      .replace(/(\d+)\s*ml\.?/gi, "$1 मिलीलीटर")
      .replace(/(\d+)\s*g\.?/gi, "$1 ग्राम")
      .replace(/(\d+)\s*(?:acre|acres)\.?/gi, "$1 एकड़")
      .replace(/(\d+)\s*(?:ha|hectare|hectares)\.?/gi, "$1 हेक्टेयर")
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, "$1 रुपये")
      .replace(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, "$1 रुपये")
      .replace(/\bTNAU\b/g, "टी.एन.ए.यू")
      .replace(/\bICAR\b/g, "आई.सी.ए.आर")
      .replace(/\bDAP\b/g, "डी.ए.पी")
      .replace(/\bNPK\b/g, "एन.पी.के")
      .replace(/\bPM-?KISAN\b/gi, "पीएम किसान");
  } else if (locale === "te") {
    clean = clean
      .replace(/(\d+)\s*%/g, "$1 శాతం")
      .replace(/%/g, " శాతం")
      .replace(/(\d+)\s*kg\.?/gi, "$1 కిలో")
      .replace(/(\d+)\s*ml\.?/gi, "$1 మిల్లీలీటర్లు")
      .replace(/(\d+)\s*(?:acre|acres)\.?/gi, "$1 ఎకరాకు")
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, "$1 రూపాయలు");
  } else if (locale === "kn") {
    clean = clean
      .replace(/(\d+)\s*%/g, "$1 ಪ್ರತಿಶತ")
      .replace(/%/g, " ಪ್ರತಿಶತ")
      .replace(/(\d+)\s*kg\.?/gi, "$1 ಕಿಲೋ")
      .replace(/(\d+)\s*ml\.?/gi, "$1 ಮಿಲಿ")
      .replace(/(\d+)\s*(?:acre|acres)\.?/gi, "$1 ಎಕರೆಗೆ")
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, "$1 ರೂಪಾಯಿ");
  } else if (locale === "ml") {
    clean = clean
      .replace(/(\d+)\s*%/g, "$1 ശതമാനം")
      .replace(/%/g, " ശതമാനം")
      .replace(/(\d+)\s*kg\.?/gi, "$1 കിലോ")
      .replace(/(\d+)\s*ml\.?/gi, "$1 മില്ലിലിറ്റർ")
      .replace(/(\d+)\s*(?:acre|acres)\.?/gi, "$1 ഏക്കറിന്")
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, "$1 രൂപ");
  } else {
    // English
    clean = clean
      .replace(/(\d+)\s*%/g, "$1 percent")
      .replace(/%/g, " percent")
      .replace(/(\d+)\s*kg\.?/gi, "$1 kilograms")
      .replace(/(\d+)\s*ml\.?/gi, "$1 milliliters")
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, "Rupees $1")
      .replace(/Rs\.?\s*(\d+(?:,\d+)*(?:\.\d+)?)/gi, "Rupees $1");
  }

  return clean.replace(/\s+/g, " ").trim();
}
