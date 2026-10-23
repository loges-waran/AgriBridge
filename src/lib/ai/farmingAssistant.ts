import { getRelevantAgricultureVideos, buildYouTubeSearchUrl, VideoExplanation } from "@/lib/agricultureVideos";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SourceCitation {
  title: string;
  organization: string;
  url?: string;
  year?: string;
}

export interface FarmingAssistantResult {
  answer: string;
  spokenText: string;
  topic: string;
  sources: SourceCitation[];
  clarifyingQuestion?: string | null;
  suggestedFollowUps: string[];
  youtubeSearchQuery: string;
  youtubeSearchUrl: string;
  videos: VideoExplanation[];
  provider: "gemini" | "openai" | "knowledge-base";
  locale: string;
}

interface DBContext {
  cropIntel: any[];
  produceListings: any[];
  inputProducts: any[];
  machineryUnits: any[];
}

/**
 * Clean text for Speech Synthesis so TTS engines speak naturally
 * without pronouncing markdown syntax, hashes, asterisks, or raw symbols.
 */
export function sanitizeForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/#{1,6}\s+/g, "") // Headings
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // Code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
    .replace(/[-*•]\s+/g, "") // Bullet points
    .replace(/[₹$]/g, "Rupees ") // Currency
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * System prompt embedding TNAU, ICAR, and Tamil Nadu agronomic standards,
 * strict chemical safeguards, investment separation, and structured output.
 */
function buildSystemPrompt(locale: string, dbData: DBContext): string {
  const languageNames: Record<string, string> = {
    ta: "Tamil (தமிழ்)",
    en: "English",
    hi: "Hindi (हिन्दी)",
    te: "Telugu (తెలుగు)",
    kn: "Kannada (ಕನ್ನಡ)",
    ml: "Malayalam (മലയാളം)",
  };

  const targetLang = languageNames[locale] || "English";

  const liveListingsSummary = dbData.produceListings.length > 0
    ? dbData.produceListings.slice(0, 3).map((p) => `${p.commodity}: ₹${p.pricePerUnit}/${p.unit} in ${p.district || "TN"}`).join("; ")
    : "Paddy Ponni ₹2,400/qtl; Turmeric Erode ₹14,200/qtl";

  return `You are AgriBridge AI, an authoritative, empathetic agriculture and agribusiness intelligence assistant specializing in Tamil Nadu and Indian farming.
You strictly adhere to TNAU (Tamil Nadu Agricultural University), ICAR, and the Tamil Nadu Department of Agriculture & Farmers Welfare standards.

CRITICAL INSTRUCTIONS & SAFEGUARDS:
1. STRICT AGRICULTURE-ONLY SCOPE:
   - You are strictly an agriculture, farming, and agri-business specialist. You MUST ONLY answer questions related to agriculture: crops, cultivation, crop diseases, pests, soil health, irrigation, fertilizers, seeds, farm machinery, agricultural labour, agricultural finance, government schemes, market prices, weather advisories, storage, and agricultural transport.
   - If the user asks a question that is NOT related to agriculture (e.g. movies, celebrities, sports, generic coding, politics, video games, jokes, general web queries), you MUST politely decline in ${targetLang} and explain that AgriVoice is exclusively dedicated to agricultural advisory, redirecting them to ask an agriculture-related question.
   - Do NOT invent diagnoses, prices, schemes, or guarantees.
   - For real-time weather and fluctuating market prices, disclose when information is a recent benchmark and cannot be verified in real-time without checking local mandis.

2. UNDERSTAND ACTUAL INTENT & CONTEXT:
   - Carefully discern what the user is asking.
   - NEVER answer an investment or financing question with pest control information.
   - If the user asks about investments, farmland leasing, or returns, focus strictly on agricultural finance, project budgets, and profit-sharing models.
   - If the user asks about pests/diseases, focus on IPM, cultural practices, and biological/chemical measures.
   - Maintain multi-turn conversational context without confusing previous subjects.

3. TARGET LANGUAGE:
   - Formulate your response in ${targetLang}.
   - The 'answer' field must be in ${targetLang}.
   - The 'spokenText' field must also be in ${targetLang}, written in clear spoken phrasing with no markdown symbols, hashes, or asterisks.
   - 'suggestedFollowUps' and 'clarifyingQuestion' must also be in ${targetLang}.

4. AGRICULTURAL CHEMICAL & DOSAGE SAFEGUARDS:
   - Strictly follow TNAU Crop Production Guide recommendations.
   - Always mention the chemical's active ingredient and formulation (e.g. Chlorantraniliprole 18.5% SC, Cartap Hydrochloride 50% SP, Carbendazim 50% WP).
   - Never recommend banned or hazardous unapproved chemicals.
   - Include a mandatory advisory: "Always consult your local Assistant Agricultural Officer (AAO) or TNAU KVK before spraying, and follow label waiting periods."

5. FINANCIAL, MARKET PRICE & SCHEME SAFEGUARDS:
   - Distinguish verified facts (MSP, official scheme guidelines) from daily fluctuating estimates.
   - For Mandi prices, cite them as recent benchmarks (e.g., active platform bids: ${liveListingsSummary}) and remind farmers that mandi rates change daily.
   - For investments on AgriBridge, clearly state that returns depend on actual crop harvest, weather risks, and operational costs (no guaranteed fixed interest claims).
   - For government schemes, reference official Tamil Nadu initiatives (Kalaignarin All Village Integrated Agriculture Development Programme, Kuruvai Package, PM-KISAN, PMFBY crop insurance, Free Agricultural Power Scheme, and the Uzhavan App).

5. CLARIFYING QUESTIONS:
   - If essential information is missing to give precise advice (such as crop age in days, variety, acreage, soil type, or symptoms), ask ONE polite, helpful clarifying question in the 'clarifyingQuestion' field. Otherwise set it to null.

6. TARGETED YOUTUBE SEARCH QUERY:
   - In the 'youtubeSearchQuery' field, provide a high-precision, natural search string containing the exact crop, issue/topic, location, and language (e.g., "TNAU paddy yellow stem borer management Tamil" or "Uzhavan app farmer scheme registration Tamil Nadu").

7. JSON OUTPUT FORMAT:
   Return ONLY a valid JSON object matching this schema:
   {
     "answer": "Clear, direct, practical answer in ${targetLang}",
     "spokenText": "Spoken version in ${targetLang} without asterisks or markdown",
     "topic": "Short 2-4 word topic title",
     "sources": [{"title": "Document or Guide Name", "organization": "TNAU / ICAR / Dept of Agriculture", "year": "2024-2026"}],
     "clarifyingQuestion": "Optional follow-up question in ${targetLang} or null",
     "suggestedFollowUps": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"],
     "youtubeSearchQuery": "Precision YouTube search query"
   }`;
}

/**
 * Call Google Gemini API (gemini-3.1-flash-lite / gemini-3.5-flash)
 */
async function callGeminiAPI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: ChatMessage[],
  locale: string
): Promise<any | null> {
  const models = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"];

  // Format conversational turns
  const contents: any[] = [];

  // Pass history turns (up to 4 previous messages)
  const recentHistory = history.slice(-4);
  for (const h of recentHistory) {
    contents.push({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    });
  }

  // Current turn with system instruction prompt
  const userPrompt = `${systemPrompt}\n\nUser Question: ${userMessage}\nTarget Language: ${locale}\nOutput valid JSON ONLY.`;
  contents.push({
    role: "user",
    parts: [{ text: userPrompt }],
  });

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return { ...parsed, provider: "gemini" };
        }
      } else {
        console.warn(`Gemini model ${model} returned HTTP ${res.status}`);
      }
    } catch (err: any) {
      console.warn(`Gemini model ${model} attempt failed: ${err.message}`);
    }
  }

  return null;
}

/**
 * Call OpenAI API if OPENAI_API_KEY is configured
 */
async function callOpenAIAPI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: ChatMessage[],
  locale: string
): Promise<any | null> {
  try {
    const messages: any[] = [
      { role: "system", content: `${systemPrompt}\nAlways reply with valid JSON only.` },
    ];

    for (const h of history.slice(-4)) {
      messages.push({
        role: h.role === "assistant" ? "assistant" : "user",
        content: h.content,
      });
    }

    messages.push({
      role: "user",
      content: `Question: ${userMessage}\nTarget Language: ${locale}`,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        return { ...parsed, provider: "openai" };
      }
    }
  } catch (err: any) {
    console.warn("OpenAI API call failed:", err.message);
  }

  return null;
}

/**
 * Domain-grounded fallback knowledge engine for offline or fallback scenarios.
 * Strictly separates intents (e.g. investment vs pest control) and includes TNAU safeguards.
 */
function generateDomainFallback(
  userMessage: string,
  history: ChatMessage[],
  locale: string,
  dbData: DBContext
): any {
  const query = userMessage.toLowerCase();
  const isTamil = locale === "ta";

  // 0. Strict Agriculture-Only Filter: Politely decline completely unrelated topics
  const nonAgriKeywords = [
    "movie", "cinema", "cricket", "football", "song", "actor", "actress",
    "joke", "code", "python", "javascript", "react", "html", "css", "c++", "java",
    "game", "gaming", "politician", "election", "celebrity", "crypto", "bitcoin",
    "formula", "physics", "chemistry equation", "box office", "padam", "trailer",
    "பாடல்", "திரைப்படம்", "நடிகர்", "கிரிக்கெட்", "விளையாட்டு", "அரசியல்"
  ];

  const containsNonAgri = nonAgriKeywords.some((kw) => query.includes(kw));
  // Ensure it's not a mixed query that actually discusses agriculture
  const hasAgriKeywords = [
    "farm", "crop", "paddy", "soil", "pest", "fertilizer", "seed", "water",
    "cultivat", "harvest", "field", "tractor", "mandi", "விவசாய", "பயிர்", "நெல்", "உரம்"
  ].some((kw) => query.includes(kw));

  if (containsNonAgri && !hasAgriKeywords) {
    return {
      topic: isTamil ? "விவசாய ஆலோசனை மட்டுமே" : "Agriculture Scope Only",
      answer: isTamil
        ? "வணக்கம்! அக்ரிபிரிட்ஜ் (AgriVoice) AI உதவியாளர் விவசாயம், பயிர் சாகுபடி, பூச்சி-நோய் மேலாண்மை, உரம், பாசனம், அரசு நலத்திட்டங்கள் மற்றும் சந்தை விலைகளுக்கு மட்டுமே பிரத்யேகமாக வழிகாட்ட வடிவமைக்கப்பட்டுள்ளது. பிற துறைகள் சார்ந்த வினாக்களுக்கு என்னால் பதிலளிக்க இயலாது. உங்கள் விவசாயம் மற்றும் பண்ணை சார்ந்த கேள்விகளை தயவுசெய்து கேளுங்கள்."
        : "I am AgriVoice, an assistant dedicated exclusively to agriculture, farming, and agri-business. I can only assist with agricultural topics such as crop cultivation, pest and disease management, fertilizers, irrigation, weather advisories, farm machinery, agricultural finance, government schemes, and mandi market prices. Please feel free to ask any farming-related question!",
      spokenText: isTamil
        ? "மன்னிக்கவும். நான் விவசாயம் மற்றும் பண்ணை வழிகாட்டுதலுக்கு மட்டுமே பதிலளிக்க முடியும். தயவுசெய்து விவசாயம் சார்ந்த கேள்விகளைக் கேளுங்கள்."
        : "I am exclusively an agricultural assistant. Please ask any farming-related question regarding crops, fertilizers, machinery, or mandi prices.",
      sources: [
        { title: "AgriBridge Agricultural Advisory Protocol", organization: "AgriBridge Ecosystem Governance" },
        { title: "TNAU Agritech Extension Advisory", organization: "Tamil Nadu Agricultural University" },
      ],
      clarifyingQuestion: isTamil
        ? "உங்கள் பண்ணை திட்டம் அல்லது பயிர் பாதுகாப்பு குறித்து நான் உதவட்டுமா?"
        : "Would you like advice on crop selection, pest control, or current mandi prices?",
      suggestedFollowUps: isTamil
        ? ["நெல் தண்டு துளைப்பான் கட்டுப்பாடு", "குறுவை நெல் உர அட்டவணை", "உழவன் செயலி அரசு திட்டங்கள்", "மண்டி நெல் கொள்முதல் விலை"]
        : ["Paddy stem borer IPM control", "Kuruvai fertilizer dosage schedule", "Uzhavan App government subsidies", "Current paddy procurement price"],
      youtubeSearchQuery: "TNAU agriculture cultivation guide Tamil Nadu",
      provider: "knowledge-base",
    };
  }

  // 1. Check for Investment & Agricultural Finance Intent
  if (
    query.includes("invest") ||
    query.includes("roi") ||
    query.includes("fund") ||
    query.includes("profit") ||
    query.includes("capital") ||
    query.includes("share") ||
    query.includes("முதலீடு") ||
    query.includes("பங்கு") ||
    query.includes("லாபம்")
  ) {
    const isTamil = locale === "ta";
    return {
      topic: isTamil ? "வேளாண் முதலீடு & கூட்டுறவு" : "Agricultural Investment & Partnership",
      answer: isTamil
        ? "அக்ரிபிரிட்ஜ் தளத்தில் விவசாய முதலீடுகள் வெளிப்படையான லாபப் பகிர்வு (Profit-Sharing) முறையில் செயல்படுத்தப்படுகின்றன. நில உரிமையாளர்கள், முதலீட்டாளர்கள் மற்றும் திறமையான விவசாயிகள் பயிர் சாகுபடி திட்டங்களை இணைந்து உருவாக்குகின்றனர். முதலீட்டின் மீதான வருவாய் அறுவடை மகசூல் மற்றும் சந்தை விலையைப் பொறுத்தது; நிலையான வட்டி வாக்குறுதிகள் வழங்கப்படுவதில்லை. அனைத்து நிதி பரிவர்த்தனைகளும் ஒப்பந்தங்கள் மூலம் கண்காணிக்கப்படுகின்றன."
        : "On AgriBridge, agricultural investments are structured through transparent profit-sharing agreements. Landowners, agri-investors, and farmers co-create cultivation projects with itemized budgets for seeds, labor, and machinery. Returns depend directly on actual harvest yield and prevailing mandi market prices; there are no speculative guaranteed returns. All project financials and resource allocation are tracked transparently.",
      spokenText: isTamil
        ? "அக்ரிபிரிட்ஜ் தளத்தில் விவசாய முதலீடுகள் வெளிப்படையான லாபப் பகிர்வு முறையில் செயல்படுகின்றன. வருவாய் மகசூல் மற்றும் சந்தை விலையைப் பொறுத்தது. எந்த நிலையான வட்டி வாக்குறுதியும் வழங்கப்படுவதில்லை."
        : "On AgriBridge, agricultural investments are structured through transparent profit-sharing agreements. Returns depend on actual harvest yield and market prices, without speculative fixed guarantees.",
      sources: [
        { title: "AgriBridge Collective Farming & Investment Protocol", organization: "AgriBridge Governance" },
        { title: "Model Contract Farming and Services Act", organization: "Ministry of Agriculture" },
      ],
      clarifyingQuestion: isTamil
        ? "நீங்கள் முதலீட்டாளராக இணைய விரும்புகிறீர்களா அல்லது உங்கள் பண்ணை திட்டத்திற்கு மூலதனம் தேடுகிறீர்களா?"
        : "Are you looking to invest capital as an agri-investor, or are you seeking funding for your farm project?",
      suggestedFollowUps: isTamil
        ? ["பண்ணை திட்டத்தில் முதலீடு செய்வது எப்படி?", "லாபப் பகிர்வு விகிதம் எவ்வாறு கணக்கிடப்படுகிறது?", "விவசாய திட்டத்தை தொடங்குவது எப்படி?"]
        : ["How to fund a verified farm project?", "How is the profit-sharing ratio calculated?", "How to list farmland on AgriBridge?"],
      youtubeSearchQuery: "AgriBridge collective farming agriculture investment Tamil Nadu",
      provider: "knowledge-base",
    };
  }

  // 2. Check for Government Schemes & Subsidies Intent
  if (
    query.includes("scheme") ||
    query.includes("திட்ட") ||
    query.includes("subsid") ||
    query.includes("மானிய") ||
    query.includes("kisan") ||
    query.includes("uzhavan") ||
    query.includes("உழவன்") ||
    query.includes("insurance") ||
    query.includes("காப்பீடு")
  ) {
    const isTamil = locale === "ta";
    return {
      topic: isTamil ? "அரசு நலத்திட்டங்கள் & மானியங்கள்" : "Government Schemes & Subsidies",
      answer: isTamil
        ? "தமிழ்நாடு அரசால் வழங்கப்படும் முக்கிய வேளாண் திட்டங்கள்:\n1. குறுவை சாகுபடி தொகுப்புத் திட்டம்: பாசன வசதியுள்ள டெல்டா விவசாயிகளுக்கு இலவச/மானfilterized உரம் மற்றும் விதைகள்.\n2. கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண்மை வளர்ச்சி திட்டம்: கிராம அளவில் தரிசு நில மேம்பாடு மற்றும் ஆழ்துளை கிணறு மானியங்கள்.\n3. உழவன் செயலி (Uzhavan App): அரசு மானியங்கள், பயிர் காப்பீடு (PMFBY), வேளாண் இயந்திர வாடகை முன்பதிவு.\n4. பி.எம்-கிசான் (PM-KISAN): ஆண்டுக்கு ₹6,000 நேரடி உதவித்தொகை.\nகுறிப்பு: அருகிலுள்ள வட்டார வேளாண்மை விரிவாக்க மையம் (ADA Office) அல்லது உழவன் செயலியில் பதிவு செய்யவும்."
        : "Key Tamil Nadu & Central Government Agricultural Schemes:\n1. Kuruvai Cultivation Package: Subsidized seeds, bio-fertilizers, and zinc sulphate for delta farmers.\n2. Kalaignarin All Village Integrated Agriculture Development Programme: Fallow land reclamation and micro-irrigation grants.\n3. Uzhavan App (உழவன் செயலி): Single-window portal for subsidies, PMFBY crop insurance tracking, and farm machinery rental.\n4. PM-KISAN: Direct benefit transfer of ₹6,000 annually in three installments.\nNote: Verify active seasonal enrollment at your local Block Agriculture Extension Office or through the Uzhavan App.",
      spokenText: isTamil
        ? "தமிழ்நாடு விவசாயிகளுக்கு குறுவை தொகுப்பு திட்டம், உழவன் செயலி மானியங்கள் மற்றும் பி எம் கிசான் நிதி உதவி கிடைக்கின்றன. விவரங்களுக்கு வட்டார வேளாண்மை அலுவலகத்தை தொடர்பு கொள்ளவும்."
        : "Key government schemes include the Kuruvai cultivation package, Uzhavan App subsidies for machinery, and PM-KISAN financial support. Visit your local Agriculture Extension Office for active enrollment.",
      sources: [
        { title: "Tamil Nadu Agriculture Budget & Schemes Guidelines", organization: "Dept of Agriculture & Farmers Welfare, GoTN" },
        { title: "Uzhavan App Portal Guide", organization: "Agritech Portal TNAU" },
      ],
      clarifyingQuestion: isTamil
        ? "உங்கள் கிராமம் கலைஞரின் ஒருங்கிணைந்த வேளாண்மை வளர்ச்சி திட்டத்தில் தேர்வு செய்யப்பட்டுள்ளதா?"
        : "Which district is your farmland located in, and are you registered on the Uzhavan portal?",
      suggestedFollowUps: isTamil
        ? ["உழவன் செயலியில் இயந்திர வாடகை பதிவு செய்வது எப்படி?", "பயிர் காப்பீடு PMFBY பதிவு காலம் என்ன?", "குறுவை தொகுப்பு பெற தேவையான ஆவணங்கள் என்ன?"]
        : ["How to apply for machinery subsidy on Uzhavan App?", "What are the deadlines for PMFBY crop insurance?", "What documents are required for PM-KISAN?"],
      youtubeSearchQuery: "Uzhavan app farmer scheme registration Tamil Nadu",
      provider: "knowledge-base",
    };
  }

  // 3. Check for Market Prices & Mandi Rates Intent
  if (
    query.includes("price") ||
    query.includes("rate") ||
    query.includes("mandi") ||
    query.includes("விலை") ||
    query.includes("சந்தை") ||
    query.includes("விற்பனை")
  ) {
    const isTamil = locale === "ta";
    return {
      topic: isTamil ? "சந்தை விலை நிலவரம் & MSP" : "Market Prices & Mandi Intelligence",
      answer: isTamil
        ? "தமிழ்நாடு சந்தை மற்றும் அக்ரிபிரிட்ஜ் தளம் சார்ந்த சமீபத்திய விலை வழிகாட்டுதல்:\n• நெல் (Paddy Ponni / Common): அரசு நேரடி கொள்முதல் விலை (MSP) ₹2,320 முதல் ₹2,450/குவிண்டால் (உள்ளூர் ஊக்கத்தொகையுடன்).\n• மஞ்சள் (Turmeric Finger): ஈரோடு/சேலம் சந்தைகளில் ₹13,500 - ₹14,800/குவிண்டால்.\n• வாழை (G9/Poovan): ₹18 - ₹26/கிலோ.\nஎச்சரிக்கை: தினசரி சந்தை வரத்து மற்றும் ஈரப்பதத்தைப் பொறுத்து மண்டி விலைகள் மாறும். அறுவடைக்கு முன் அக்ரிபிரிட்ஜ் நேரடி மொத்த கொள்முதல் வியாபாரிகளிடம் உறுதி செய்யவும்."
        : "Tamil Nadu Benchmark Mandi & AgriBridge Marketplace Pricing:\n• Paddy (Grade A / Ponni): DPC procurement benchmark ₹2,320 - ₹2,450/quintal.\n• Turmeric (Finger, Erode): ₹13,500 - ₹14,800/quintal depending on curcumin content.\n• Banana (Grand Naine / Poovan): ₹18 - ₹26/kg wholesale.\nSafeguard Notice: Mandi prices fluctuate daily depending on moisture content and arrivals. Connect directly with verified buyers on AgriBridge to lock in forward delivery pricing.",
      spokenText: isTamil
        ? "நெல் அரசு கொள்முதல் விலை குவிண்டாலுக்கு சுமார் 2,320 முதல் 2,450 ரூபாய் வரை உள்ளது. மஞ்சள் ஈரோடு சந்தையில் 14,000 ரூபாய் வரை விற்பனையாகிறது. சந்தை நிலவரம் தினமும் மாறுபடும்."
        : "Paddy government procurement benchmark is around 2,320 to 2,450 rupees per quintal, while turmeric trades near 14,000 rupees in Erode. Prices vary daily based on quality and arrivals.",
      sources: [
        { title: "Direct Purchase Center (DPC) Minimum Support Prices", organization: "Tamil Nadu Civil Supplies Corp" },
        { title: "Regulated Market Committee (RMC) Daily Bulletins", organization: "Tamil Nadu State Agricultural Marketing Board" },
      ],
      clarifyingQuestion: isTamil
        ? "நீங்கள் விற்பனை செய்ய விரும்பும் விளைபொருளின் ரகம் மற்றும் இருப்பு அளவு என்ன?"
        : "What specific crop variety and harvest quantity are you planning to sell?",
      suggestedFollowUps: isTamil
        ? ["அக்ரிபிரிட்ஜில் மொத்த வியாபாரிகளுடன் இணைவது எப்படி?", "நெல் கொள்முதல் நிலைய ஈரப்பத அளவு விதிகள் என்ன?", "மஞ்சள் சேமிப்பு கிடங்கு வசதிகள் எங்குள்ளன?"]
        : ["How to list harvest on AgriBridge marketplace?", "What is the permissible moisture limit at paddy procurement centers?", "How to get warehouse receipts for produce?"],
      youtubeSearchQuery: "Tamil Nadu agricultural mandi prices uzhavan sandhai",
      provider: "knowledge-base",
    };
  }

  // 4. Check for Pest & Disease Control Intent
  if (
    query.includes("pest") ||
    query.includes("disease") ||
    query.includes("stem borer") ||
    query.includes("blast") ||
    query.includes("rot") ||
    query.includes("பூச்சி") ||
    query.includes("நோய்") ||
    query.includes("தண்டு துளைப்பான்") ||
    query.includes("குருத்து") ||
    query.includes("குலை நோய்")
  ) {
    const isTamil = locale === "ta";
    return {
      topic: isTamil ? "நெல் தண்டு துளைப்பான் & பூச்சி மேலாண்மை" : "Paddy Stem Borer & Pest Management",
      answer: isTamil
        ? "தமிழ்நாடு வேளாண் பல்கலைக்கழகம் (TNAU) பரிந்துரைக்கும் நெல் தண்டு துளைப்பான் மற்றும் பூச்சி ஒருங்கிணைந்த மேலாண்மை (IPM):\n1. இனக்கவர்ச்சி பொறி (Pheromone Traps): ஏக்கருக்கு 5 பொறிகள் வைத்து அந்துப்பூச்சி நடமாட்டத்தை கண்காணிக்கவும்.\n2. இயற்கை முறை: ஏக்கருக்கு 2.5 சிசி ட்ரைக்கோடெர்மா ஜப்பானிகம் (Trichogramma japonicum) ஒட்டுண்ணி அட்டைகளை நடுவு செய்த 37-ம் நாளிலிருந்து வாரம் ஒருமுறை 3 முறை கட்டவும்.\n3. ரசாயன கட்டுப்பாடு (பொருளாதார சேத நிலை 5% குருத்து அழுகல் தாண்டும்போது):\n• குளோரான்ட்ரானிலிப்ரோல் 18.5% SC (Chlorantraniliprole) - ஏக்கருக்கு 60 மி.லி.\n• அல்லது கார்டாப் ஹைட்ரோகுளோரைடு 50% SP - ஏக்கருக்கு 400 கிராம்.\nபாதுகாப்பு எச்சரிக்கை: பூச்சிக்கொல்லிகளை தெளிக்கும் முன் வட்டார வேளாண் அலுவலரிடம் அளவு மற்றும் பாதுகாப்பு விதிகளை உறுதி செய்யவும்."
        : "TNAU Recommended Integrated Pest Management (IPM) for Rice Yellow Stem Borer:\n1. Monitoring: Install 5 pheromone traps per acre to monitor adult moth population.\n2. Biological Control: Release Trichogramma japonicum egg parasitoids at 2.5 cc/acre, 3 times at weekly intervals starting 37 days after transplanting.\n3. Chemical Control (when Economic Threshold Level exceeds 5% dead hearts or 1 adult moth/m²):\n• Chlorantraniliprole 18.5% SC at 60 ml/acre (diluted in 200 liters of water)\n• OR Cartap Hydrochloride 50% SP at 400 g/acre.\nSafety Precaution: Always consult your local Agriculture Extension Officer or TNAU KVK before chemical spraying. Observe recommended safety withholding periods.",
      spokenText: isTamil
        ? "நெல் தண்டு துளைப்பான் கட்டுப்படுத்த ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறி வைக்கவும். பாதிப்பு அதிகமாக இருந்தால் குளோரான்ட்ரானிலிப்ரோல் 60 மிலி தெளிக்கவும். பூச்சி மருந்து தெளிக்கும் முன் வேளாண் அலுவலரிடம் ஆலோசனை பெறவும்."
        : "To control rice yellow stem borer, set up 5 pheromone traps per acre. If damage exceeds five percent dead hearts, apply Chlorantraniliprole at 60 ml per acre. Consult your local agriculture extension officer before spraying.",
      sources: [
        { title: "TNAU Crop Protection Guide - Rice Pests", organization: "Tamil Nadu Agricultural University (TNAU)" },
        { title: "Integrated Pest Management Guidelines", organization: "ICAR - National Research Centre for Integrated Pest Management" },
      ],
      clarifyingQuestion: isTamil
        ? "உங்கள் நெல் பயிர் நட்டு எத்தனை நாட்கள் ஆகிறது? குருத்து காய்ந்துவிட்டதா அல்லது வெண்கதிர் தோன்றியுள்ளதா?"
        : "What is the age of your paddy crop in days, and are you observing dead hearts or white ears?",
      suggestedFollowUps: isTamil
        ? ["தண்டு துளைப்பான் இனக்கவர்ச்சி பொறி அமைப்பது எப்படி?", "இயற்கை முறையில் வேப்பெண்ணெய் தெளிப்பது எப்படி?", "நெல் குலை நோய் அறிகுறிகள் என்ன?"]
        : ["How to set up pheromone traps for paddy stem borer?", "How to use neem oil spray organically?", "What are the early signs of paddy blast disease?"],
      youtubeSearchQuery: "TNAU paddy stem borer management Tamil",
      provider: "knowledge-base",
    };
  }

  // 5. Default General Agriculture Guidance
  return {
    topic: isTamil ? "வேளாண் ஆலோசனை" : "Agricultural Guidance",
    answer: isTamil
      ? "வணக்கம்! அக்ரிபிரிட்ஜ் வேளாண் உதவியாளர் உங்கள் விவசாய சவால்களுக்கு வழிகாட்ட தயாராக உள்ளது. தமிழ்நாடு வேளாண் பல்கலைக்கழகம் (TNAU) பரிந்துரைகளின்படி நெல், மஞ்சள், வாழை பயிர் பாதுகாப்பு, உர அட்டவணை, அரசு மானியங்கள் மற்றும் சந்தை விலைகள் குறித்த துல்லியமான தகவல்களை பெறலாம்."
      : "Welcome to AgriBridge AI Farming Assistant. We provide grounded agronomic advice aligned with Tamil Nadu Agricultural University (TNAU) and ICAR research for paddy, cash crops, balanced fertilization, government subsidies, and farm resource gaps.",
    spokenText: isTamil
      ? "வணக்கம்! நெல், மஞ்சள் பயிர் பாதுகாப்பு, உர மேலாண்மை, அரசு மானியங்கள் மற்றும் சந்தை விலைகள் குறித்து நீங்கள் கேட்கலாம்."
      : "Welcome! Ask any question about paddy diseases, fertilizer schedules, government subsidies, or market prices.",
    sources: [
      { title: "TNAU Agritech Portal", organization: "Tamil Nadu Agricultural University" },
    ],
    clarifyingQuestion: isTamil
      ? "நீங்கள் எந்த பயிர் சாகுபடி செய்கிறீர்கள் அல்லது எந்த தகவல் தேவைப்படுகிறது?"
      : "Which crop are you currently cultivating, or what specific farming guidance do you need?",
    suggestedFollowUps: isTamil
      ? ["நெல்லில் தண்டு துளைப்பான் கட்டுப்பாடு", "குறுவை நெல் உர அட்டவணை", "உழவன் செயலி அரசு திட்டங்கள்", "மண்டி சந்தை விலைகள்"]
      : ["Paddy stem borer control", "Kuruvai paddy fertilizer schedule", "Uzhavan App government schemes", "Current mandi market prices"],
    youtubeSearchQuery: "TNAU agriculture cultivation guide Tamil Nadu",
    provider: "knowledge-base",
  };
}

/**
 * Main Agricultural Intelligence Query Processor
 */
export async function processFarmingQuery(
  userMessage: string,
  locale: string,
  history: ChatMessage[] = [],
  dbData: DBContext
): Promise<FarmingAssistantResult> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const systemPrompt = buildSystemPrompt(locale, dbData);

  let rawResult: any = null;

  // 1. Try Google Gemini API if key is present
  if (geminiKey && geminiKey.trim()) {
    rawResult = await callGeminiAPI(geminiKey, systemPrompt, userMessage, history, locale);
  }

  // 2. Try OpenAI API if Gemini was not available or failed
  if (!rawResult && openaiKey && openaiKey.trim()) {
    rawResult = await callOpenAIAPI(openaiKey, systemPrompt, userMessage, history, locale);
  }

  // 3. Fallback to domain-grounded knowledge engine
  if (!rawResult) {
    rawResult = generateDomainFallback(userMessage, history, locale, dbData);
  }

  // Ensure answer and spokenText exist
  const answer = rawResult.answer || "Information temporarily unavailable.";
  const spokenText = sanitizeForSpeech(rawResult.spokenText || answer);
  const topic = rawResult.topic || "Agricultural Guidance";
  const sources: SourceCitation[] = Array.isArray(rawResult.sources) ? rawResult.sources : [];
  const clarifyingQuestion = rawResult.clarifyingQuestion || null;
  const suggestedFollowUps = Array.isArray(rawResult.suggestedFollowUps) ? rawResult.suggestedFollowUps : [];
  const youtubeSearchQuery = rawResult.youtubeSearchQuery || `${topic} Tamil Nadu agriculture`;
  const youtubeSearchUrl = buildYouTubeSearchUrl(youtubeSearchQuery);

  // Retrieve genuine videos strictly matching the intent and topic
  const videos = getRelevantAgricultureVideos(topic, `${userMessage} ${youtubeSearchQuery}`);

  return {
    answer,
    spokenText,
    topic,
    sources,
    clarifyingQuestion,
    suggestedFollowUps,
    youtubeSearchQuery,
    youtubeSearchUrl,
    videos,
    provider: rawResult.provider || "knowledge-base",
    locale,
  };
}
