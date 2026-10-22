async function runE2ETests() {
  console.log("============================================================");
  console.log("AgriBridge AgriVoice Assistant: Rigorous E2E Verification");
  console.log("============================================================\n");

  const baseUrl = "http://localhost:3000/api/intelligence/assistant";

  const tests = [
    // 1. Unrelated consecutive test: Pest question followed by Investment question
    {
      name: "Intent Distinction: Investment question after Pest discussion",
      payload: {
        message: "Can I invest capital as an agri-investor in a farm project? What are the returns and profit sharing?",
        locale: "en",
        history: [
          { role: "user", content: "How to kill yellow stem borer in paddy fields?" },
          { role: "assistant", content: "Apply Chlorantraniliprole 18.5% SC at 60 ml/acre after monitoring with pheromone traps." },
        ],
      },
      verify: (data) => {
        const text = (data.answer + " " + data.topic).toLowerCase();
        // MUST NOT talk about pests
        if (text.includes("stem borer") || text.includes("chlorantraniliprole") || text.includes("dead heart")) {
          throw new Error("FAILED: Investment question returned pest control information!");
        }
        // MUST talk about investment / profit sharing / capital
        if (!text.includes("invest") && !text.includes("profit") && !text.includes("capital")) {
          throw new Error("FAILED: Did not address investment or profit-sharing intent.");
        }
        // MUST NOT return pest video recommendations
        if (data.videos && data.videos.length > 0) {
          const vidTitles = data.videos.map(v => v.title.toLowerCase()).join(" ");
          if (vidTitles.includes("stem borer") || vidTitles.includes("pest")) {
            throw new Error("FAILED: Returned unrelated pest video for an investment question!");
          }
        }
        return `Pass (Topic: ${data.topic}, Provider: ${data.provider}, Videos: ${data.videos?.length || 0})`;
      },
    },

    // 2. Multi-turn Follow-up Context Tracking
    {
      name: "Context Preservation: Kuruvai fertilizer schedule after paddy setup",
      payload: {
        message: "When should I apply basal fertilizer for this crop?",
        locale: "ta",
        history: [
          { role: "user", content: "நான் தஞ்சாவூரில் குறுவை நெல் சாகுபடி செய்கிறேன்." },
          { role: "assistant", content: "குறுவை நெல் சாகுபடிக்கு ADT 37, ASD 16 குறுகிய கால ரகங்கள் உகந்தவை." },
        ],
      },
      verify: (data) => {
        const text = (data.answer + " " + data.spokenText).toLowerCase();
        if (!text.includes("உரம்") && !text.includes("அடி உரம்") && !text.includes("fertiliz")) {
          throw new Error("FAILED: Did not provide fertilizer schedule in Tamil.");
        }
        if (data.spokenText.includes("**") || data.spokenText.includes("##")) {
          throw new Error("FAILED: spokenText contains uncleaned markdown syntax.");
        }
        return `Pass (Topic: ${data.topic}, Clarifying Question: ${data.clarifyingQuestion ? "Yes" : "None"})`;
      },
    },

    // 3. Chemical Dosage Safeguard & Sources
    {
      name: "Chemical & Dosage Safeguards: Rice blast disease",
      payload: {
        message: "How to treat blast disease in paddy? Give chemical dose.",
        locale: "en",
      },
      verify: (data) => {
        const text = data.answer.toLowerCase();
        // Check for safety warning
        if (!text.includes("consult") && !text.includes("officer") && !text.includes("precaution") && !text.includes("safety")) {
          throw new Error("FAILED: Missing pesticide safety consultation warning.");
        }
        // Check for sources citation
        if (!data.sources || data.sources.length === 0) {
          throw new Error("FAILED: Sources array is empty; expected TNAU / ICAR citations.");
        }
        return `Pass (Sources: ${data.sources.map(s => s.organization).join(", ")})`;
      },
    },

    // 4. Targeted YouTube search query generation
    {
      name: "YouTube Query Generation & Video Relevance",
      payload: {
        message: "How to manage turmeric rhizome rot and drip irrigation?",
        locale: "en",
      },
      verify: (data) => {
        if (!data.youtubeSearchQuery || data.youtubeSearchQuery.length < 5) {
          throw new Error("FAILED: Missing or invalid youtubeSearchQuery.");
        }
        if (!data.youtubeSearchUrl || !data.youtubeSearchUrl.startsWith("https://www.youtube.com/results?")) {
          throw new Error("FAILED: Missing or invalid youtubeSearchUrl.");
        }
        return `Pass (YouTube Search Query: "${data.youtubeSearchQuery}")`;
      },
    },

    // 5. Hindi Multilingual Query
    {
      name: "Multilingual Intelligence: Hindi Government Schemes",
      payload: {
        message: "किसानों के लिए सरकारी सब्सिडी और पीएम किसान योजना की जानकारी दीजिए।",
        locale: "hi",
      },
      verify: (data) => {
        if (!data.answer || data.answer.length < 30) {
          throw new Error("FAILED: Hindi response too short or empty.");
        }
        return `Pass (Topic: ${data.topic})`;
      },
    },

    // 6. Cross-Language: Tamil input with English voice reply
    {
      name: "Cross-Language: Tamil query with English voice response",
      payload: {
        message: "நெல்லில் தண்டு துளைப்பான் கட்டுப்பாடு முறை என்ன?",
        locale: "en",
        inputLocale: "ta",
      },
      verify: (data) => {
        // Output should be in English as requested by locale: 'en'
        const isEnglish = /[a-zA-Z]{5,}/.test(data.answer);
        if (!isEnglish) {
          throw new Error("FAILED: Response was not generated in requested response locale (English).");
        }
        return `Pass (Response in English as requested)`;
      },
    },
  ];

  let passed = 0;

  for (const t of tests) {
    console.log(`[RUNNING] ${t.name}...`);
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t.payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const summary = t.verify(data);
      console.log(`  ✓ ${summary}\n`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${err.message}\n`);
    }
  }

  console.log("============================================================");
  console.log(`E2E Verification Summary: ${passed}/${tests.length} tests passed.`);
  console.log("============================================================\n");

  if (passed === tests.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runE2ETests();
