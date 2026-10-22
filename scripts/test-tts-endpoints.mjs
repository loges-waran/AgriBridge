async function runTTSTests() {
  console.log("============================================================");
  console.log("AgriBridge Multilingual Voice Output (/api/intelligence/tts)");
  console.log("============================================================\n");

  const baseUrl = "http://localhost:3000/api/intelligence/tts";

  const testCases = [
    {
      name: "Tamil (ta-IN): Standard Agronomic Greeting",
      payload: {
        text: "வணக்கம்! அக்ரிபிரிட்ஜ் தளம் உங்களை அன்புடன் வரவேற்கிறது. உங்கள் விவசாய தேவைகளை கேளுங்கள்.",
        locale: "ta",
        speed: 1.0,
      },
      minBytes: 20000,
    },
    {
      name: "Tamil (ta-IN): Long Mixed Technical Text with Dosages & IPM",
      payload: {
        text: "நெல்லில் தண்டு துளைப்பான் பூச்சிக்கு குளோரான்ட்ரானிலிப்ரோல் 18.5% SC மருந்தை ஏக்கருக்கு 60 மிலி தெளிக்கவும். TNAU பரிந்துரைப்படி 5 இனக்கவர்ச்சி பொறி வைக்கவும். தெளிக்கும் முன் வேளாண் அலுவலரிடம் ஆலோசனை பெறவும்.",
        locale: "ta",
        speed: 1.0,
      },
      minBytes: 80000,
    },
    {
      name: "English (en-IN): Paddy Cultivation Advisory",
      payload: {
        text: "For Kuruvai paddy cultivation, TNAU recommends ADT 37 and ASD 16 varieties with balanced basal fertilization of DAP and Potash.",
        locale: "en",
        speed: 1.0,
      },
      minBytes: 30000,
    },
    {
      name: "Hindi (hi-IN): Farmer Scheme Advisory",
      payload: {
        text: "नमस्ते! पीएम किसान योजना और कृषि यंत्रों पर सरकारी सब्सिडी के लिए अपने स्थानीय कृषि कार्यालय में संपर्क करें।",
        locale: "hi",
        speed: 1.0,
      },
      minBytes: 30000,
    },
    {
      name: "Telugu (te-IN): Pest Management Advice",
      payload: {
        text: "వరి పంటలో కాండం తొలుచు పురుగు నివారణకు క్లోరాంట్రానిలిప్రోల్ 60 మి.లీ ఎకరాకు పిచికారీ చేయండి.",
        locale: "te",
        speed: 1.0,
      },
      minBytes: 25000,
    },
    {
      name: "Kannada (kn-IN): Fertilizer Guidance",
      payload: {
        text: "ನಮಸ್ಕಾರ! ಭತ್ತದ ಬೆಳೆಯಲ್ಲಿ ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ ಸೂಕ್ತ ಕೀಟನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ ಮತ್ತು ಕೃಷಿ ಅಧಿಕಾರಿಯ ಸಲಹೆ ಪಡೆಯಿರಿ.",
        locale: "kn",
        speed: 1.0,
      },
      minBytes: 25000,
    },
    {
      name: "Malayalam (ml-IN): Drip Irrigation Guidance",
      payload: {
        text: "നമസ്കാരം! മഞ്ഞൾ കൃഷിക്ക് തുള്ളിനന സമ്പ്രദായവും ജൈവവള പ്രയോഗവും കർഷകർക്ക് കൂടുതൽ വിളവ് നൽകുന്നു.",
        locale: "ml",
        speed: 1.0,
      },
      minBytes: 25000,
    },
    {
      name: "Error Handling: Empty text payload",
      payload: {
        text: "   ",
        locale: "ta",
      },
      expectedStatus: 400,
    },
  ];

  let passed = 0;

  for (const tc of testCases) {
    console.log(`[TESTING] ${tc.name}...`);
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tc.payload),
      });

      if (tc.expectedStatus) {
        if (res.status === tc.expectedStatus) {
          console.log(`  ✓ Pass: Handled error correctly with HTTP ${res.status}\n`);
          passed++;
        } else {
          console.error(`  ✗ Fail: Expected status ${tc.expectedStatus}, got ${res.status}\n`);
        }
        continue;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(`HTTP ${res.status} ${res.statusText}: ${JSON.stringify(errJson)}`);
      }

      const contentType = res.headers.get("content-type");
      const arrayBuf = await res.arrayBuffer();
      const bytes = arrayBuf.byteLength;

      if (!contentType || !contentType.includes("audio")) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }

      if (tc.minBytes && bytes < tc.minBytes) {
        throw new Error(`Audio buffer too small: received ${bytes} bytes, expected >= ${tc.minBytes}`);
      }

      console.log(`  ✓ Pass: Received ${bytes} bytes [${contentType}]\n`);
      passed++;
    } catch (err) {
      console.error(`  ✗ Fail: ${err.message}\n`);
    }
  }

  console.log("============================================================");
  console.log(`TTS Endpoint Test Summary: ${passed}/${testCases.length} tests passed.`);
  console.log("============================================================\n");

  if (passed === testCases.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTTSTests();
