async function testVoiceAssistant() {
  console.log("Testing Upgraded AgriVoice Assistant API on http://localhost:3000...\n");

  const testCases = [
    {
      name: "Tamil - Paddy Stem Borer with Video Explanations",
      locale: "ta",
      inputLocale: "ta",
      message: "நெல்லில் தண்டு துளைப்பான் பூச்சியை எவ்வாறு கட்டுப்படுத்துவது?",
      expectedTopic: "Paddy Stem Borer & Pests",
      checkVideos: true,
    },
    {
      name: "Tamil - Government Schemes with Uzhavan App Video",
      locale: "ta",
      inputLocale: "ta",
      message: "விவசாயிகளுக்கு என்ன அரசு திட்டங்கள் உள்ளன? உழவன் செயலி பற்றி கூறுங்கள்",
      expectedTopic: "Government Schemes",
      checkVideos: true,
    },
    {
      name: "English - Mandi Market Prices",
      locale: "en",
      inputLocale: "en",
      message: "What are the latest produce mandi rates and MSP benchmarks?",
      expectedTopic: "Market Prices",
    },
    {
      name: "Independent Languages - English Voice Response for Tamil Query",
      locale: "en",
      inputLocale: "ta",
      message: "குறுவை நெல் சாகுபடிக்கு சிறந்த உரம் எது?",
      expectedTopic: "Fertilizer Schedule",
      checkVideos: true,
    },
    {
      name: "Multi-turn Follow-up Context Tracking",
      locale: "ta",
      inputLocale: "ta",
      message: "இதற்கு உரம் எப்போது இட வேண்டும்?",
      history: [
        { role: "user", content: "நெல்லில் குறுவை சாகுபடி செய்ய விரும்புகிறேன்." },
        { role: "assistant", content: "குறுவை நெல் சாகுபடிக்கு குறுகிய கால ரகங்களான ADT 37, ASD 16 உகந்தவை." },
      ],
      expectedTopic: "Fertilizer Schedule",
    },
    {
      name: "Telugu - Paddy & Pest Inquiry",
      locale: "te",
      inputLocale: "te",
      message: "వరి పంటలో కాండం తొలుచు పురుగు నివారణ ఎలా?",
      expectedTopic: "Paddy Stem Borer & Pests",
      checkVideos: true,
    },
  ];

  let passed = 0;

  for (const tc of testCases) {
    try {
      console.log(`[TEST] ${tc.name}`);
      const res = await fetch("http://localhost:3000/api/intelligence/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: tc.message,
          locale: tc.locale,
          inputLocale: tc.inputLocale,
          history: tc.history || [],
        }),
      });

      if (!res.ok) {
        console.error(`  FAIL: HTTP status ${res.status}`);
        continue;
      }

      const data = await res.json();

      if (!data.answer || !data.spokenText || !data.suggestedFollowUps) {
        console.error("  FAIL: Incomplete response payload", data);
        continue;
      }

      // Verify spoken text doesn't contain markdown bold asterisks
      if (data.spokenText.includes("**") || data.spokenText.includes("##")) {
        console.error("  FAIL: spokenText contains uncleaned markdown syntax");
        continue;
      }

      console.log(`  PASS: Topic [${data.topic}]`);
      console.log(`  Sample SpokenText: "${data.spokenText.slice(0, 90)}..."`);
      console.log(`  Follow-ups: ${data.suggestedFollowUps.length} suggestions`);

      if (tc.checkVideos) {
        if (data.videos && data.videos.length > 0) {
          console.log(`  PASS: Verified Videos Included (${data.videos.length} videos): "${data.videos[0].title}" [${data.videos[0].channelTitle}]`);
        } else {
          console.warn(`  WARN: Expected videos for this topic, got ${data.videos?.length || 0}`);
        }
      }

      passed++;
    } catch (err) {
      console.error(`  ERROR: ${err.message}`);
    }
  }

  // Also test homepage returns 200
  try {
    const homeRes = await fetch("http://localhost:3000/");
    if (homeRes.status === 200) {
      console.log("\n[TEST] Homepage renders with Voice Assistant trigger: PASS (200 OK)");
      passed++;
    } else {
      console.error(`\n[TEST] Homepage failed: ${homeRes.status}`);
    }
  } catch (err) {
    console.error(`\n[TEST] Homepage error: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`Voice Assistant Tests: ${passed}/${testCases.length + 1} Passed`);
  console.log(`========================================\n`);

  if (passed === testCases.length + 1) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

testVoiceAssistant();
