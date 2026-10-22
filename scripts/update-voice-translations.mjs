import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/lib/i18n/translations.ts");
let content = fs.readFileSync(filePath, "utf-8");

const extraKeys = {
  en: `      chat_language: "Chat Language",
      input_language: "Speech Input Language",
      response_language: "Response Language",
      settings_title: "Voice & Audio Settings",
      voice_select: "Voice Profile",
      speech_speed: "Speech Speed",
      auto_read: "Auto-read replies",
      pause: "Pause",
      resume: "Resume",
      stop: "Stop",
      no_voice_warning: "No native voice available for this language on your device. Audio playback is paused to prevent incorrect pronunciation.",
      watch_video: "Watch Video Explanation",
      watch_on_youtube: "Watch on YouTube",
      source: "Source",
      verified_tutorial: "Verified Agriculture Tutorial",
      clear_confirm: "Are you sure you want to clear this conversation?",`,

  ta: `      chat_language: "உரையாடல் மொழி",
      input_language: "பேச்சு உள்ளீட்டு மொழி",
      response_language: "பதில் மொழி",
      settings_title: "குரல் மற்றும் ஆடியோ அமைப்புகள்",
      voice_select: "குரல் தேர்வு",
      speech_speed: "பேசும் வேகம்",
      auto_read: "பதில்களை தானாக வாசி",
      pause: "இடைநிறுத்து",
      resume: "தொடரவும்",
      stop: "நிறுத்து",
      no_voice_warning: "உங்கள் சாதனத்தில் இந்த மொழிக்கான குரல் நிறுவப்படவில்லை. தவறான உச்சரிப்பைத் தவிர்க்க ஆடியோ முடக்கப்பட்டுள்ளது.",
      watch_video: "வீடியோ விளக்கம் காண்க",
      watch_on_youtube: "YouTube-ல் காண்க",
      source: "மூலம்",
      verified_tutorial: "சரிபார்க்கப்பட்ட வேளாண் செய்முறை விளக்கம்",
      clear_confirm: "இந்த உரையாடலை அழிக்க விரும்புகிறீர்களா?",`,

  te: `      chat_language: "చాట్ భాష",
      input_language: "వాయిస్ ఇన్‌పుట్ భాష",
      response_language: "సమాధాన భాష",
      settings_title: "వాయిస్ మరియు ఆడియో సెట్టింగ్‌లు",
      voice_select: "వాయిస్ ఎంపిక",
      speech_speed: "మాట్లాడే వేగం",
      auto_read: "సమాధానాలను ఆటోమేటిక్‌గా చదవండి",
      pause: "పాజ్ చేయండి",
      resume: "కొనసాగించండి",
      stop: "ఆపండి",
      no_voice_warning: "ఈ భాషకు మీ పరికరంలో సహజ వాయిస్ అందుబాటులో లేదు. తప్పుడు ఉచ్చారణను నివారించడానికి ఆడియో నిలిపివేయబడింది.",
      watch_video: "వీడియో వివరణ చూడండి",
      watch_on_youtube: "YouTube లో చూడండి",
      source: "మూలం",
      verified_tutorial: "ధృవీకరించబడిన వ్యవసాయ వీడియో",
      clear_confirm: "మీరు ఈ సంభాషణను క్లియర్ చేయాలనుకుంటున్నారా?",`,

  kn: `      chat_language: "ಸಂಭಾಷಣೆಯ ಭಾಷೆ",
      input_language: "ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಭಾಷೆ",
      response_language: "ಉತ್ತರದ ಭಾಷೆ",
      settings_title: "ಧ್ವನಿ ಮತ್ತು ಆಡಿಯೋ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      voice_select: "ಧ್ವನಿ ಆಯ್ಕೆ",
      speech_speed: "ಮಾತಿನ ವೇಗ",
      auto_read: "ಉತ್ತರಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಓದಿ",
      pause: "ವಿರಾಮಗೊಳಿಸಿ",
      resume: "ಮುಂದುವರಿಸಿ",
      stop: "ನಿಲ್ಲಿಸಿ",
      no_voice_warning: "ಈ ಭಾಷೆಗೆ ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಧ್ವನಿ ಲಭ್ಯವಿಲ್ಲ. ತಪ್ಪು ಉಚ್ಚಾರಣೆಯನ್ನು ತಡೆಯಲು ಆಡಿಯೊ ನಿಲ್ಲಿಸಲಾಗಿದೆ.",
      watch_video: "ವೀಡಿಯೊ ವಿವರಣೆ ವೀಕ್ಷಿಸಿ",
      watch_on_youtube: "YouTube ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
      source: "ಮೂಲ",
      verified_tutorial: "ಪರಿಶೀಲಿಸಿದ ಕೃಷಿ ವೀಡಿಯೊ",
      clear_confirm: "ಈ ಸಂಭಾಷಣೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",`,

  ml: `      chat_language: "സംഭാഷണ ഭാഷ",
      input_language: "ശബ്ദ ഇൻപുട്ട് ഭാഷ",
      response_language: "മറുപടി ഭാഷ",
      settings_title: "വോയ്സ് & ഓഡിയോ ക്രമീകരണങ്ങൾ",
      voice_select: "വോയ്സ് തെരഞ്ഞെടുക്കുക",
      speech_speed: "സംസാര വേഗത",
      auto_read: "മറുപടികൾ സ്വയമേവ വായിക്കുക",
      pause: "താൽക്കാലികമായി നിർത്തുക",
      resume: "തുടരുക",
      stop: "നിർത്തുക",
      no_voice_warning: "ഈ ഭാഷയ്ക്കുള്ള വോയ്സ് നിങ്ങളുടെ ഉപകരണത്തിൽ ലഭ്യമല്ല. തെറ്റായ ഉച്ചാരണം ഒഴിവാക്കാൻ ഓഡിയോ നിർത്തിവെച്ചിരിക്കുന്നു.",
      watch_video: "വീഡിയോ വിശദീകരണം കാണുക",
      watch_on_youtube: "YouTube-ൽ കാണുക",
      source: "ഉറവിടം",
      verified_tutorial: "പരിശോധിച്ച കാർഷിക വീഡിയോ",
      clear_confirm: "ഈ സംഭാഷണം മായ്‌ക്കണമെന്ന് ഉറപ്പാണോ?",`,

  hi: `      chat_language: "बातचीत की भाषा",
      input_language: "वॉइस इनपुट भाषा",
      response_language: "जवाब की भाषा",
      settings_title: "ध्वनि एवं ऑडियो सेटिंग्स",
      voice_select: "आवाज़ चुनें",
      speech_speed: "बोलने की गति",
      auto_read: "जवाब अपने आप बोलकर सुनाएं",
      pause: "रोकें",
      resume: "जारी रखें",
      stop: "बंद करें",
      no_voice_warning: "इस भाषा के लिए आपके डिवाइस पर कोई आवाज़ उपलब्ध नहीं है। गलत उच्चारण से बचने के लिए ऑडियो म्यूट है।",
      watch_video: "वीडियो व्याख्या देखें",
      watch_on_youtube: "YouTube पर देखें",
      source: "स्रोत",
      verified_tutorial: "सत्यापित कृषि ट्यूटोरियल",
      clear_confirm: "क्या आप इस बातचीत को साफ़ करना चाहते हैं?",`,
};

// Check if already injected
if (content.includes("settings_title:")) {
  console.log("settings_title already present in translations.ts");
} else {
  // In each language block, find prompt_rhizome_rot line inside voice_assistant and append extra keys
  const langs = ["en", "ta", "te", "kn", "ml", "hi"];
  let modified = content;

  for (const lang of langs) {
    const targetPattern = new RegExp(`(prompt_rhizome_rot:[^\\n]+\\n)(\\s+\\},)`);
    modified = modified.replace(targetPattern, (match, p1, p2) => {
      return `${p1}${extraKeys[lang]}\n${p2}`;
    });
  }

  fs.writeFileSync(filePath, modified, "utf-8");
  console.log("Successfully injected new voice assistant keys into translations.ts!");
}
