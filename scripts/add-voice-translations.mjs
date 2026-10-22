import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/lib/i18n/translations.ts");
let content = fs.readFileSync(filePath, "utf-8");

const voiceTranslations = {
  en: `    voice_assistant: {
      button_label: "AgriVoice AI",
      title: "AgriVoice Assistant",
      subtitle: "AI Agricultural Voice Advisor",
      listening: "Listening... speak now",
      click_to_speak: "Tap mic to speak",
      tap_to_stop: "Tap to stop recording",
      processing: "Analyzing agronomic data...",
      speaking: "Speaking...",
      type_placeholder: "Ask about paddy, pests, fertilizers, schemes...",
      ask_btn: "Send",
      stop_audio: "Stop Audio",
      replay: "Listen",
      clear_chat: "Clear Chat",
      mic_not_supported: "Voice input is not supported in this browser. Please type your question.",
      mic_permission_denied: "Microphone permission was denied. Please allow microphone access in your browser settings.",
      mic_error: "Microphone error occurred. Please try speaking again or type your question.",
      privacy_note: "Farmer Privacy Guaranteed: Microphone activates strictly when you tap the button.",
      greeting: "Vanakkam! I am your AgriBridge AI Voice Assistant. How can I assist your farming today? Ask about paddy diseases, Kuruvai/Samba fertilizer schedules, mandi prices, or government schemes.",
      quick_prompts_title: "Suggested Inquiries:",
      prompt_paddy_pest: "How to control stem borer in paddy?",
      prompt_kuruvai_fert: "What is the fertilizer schedule for Kuruvai paddy?",
      prompt_schemes: "What Tamil Nadu government schemes are available?",
      prompt_mandi_rates: "What are the current produce mandi prices?",
      prompt_rhizome_rot: "How to prevent rhizome rot in turmeric?",
    },`,

  ta: `    voice_assistant: {
      button_label: "அக்ரி வாய்ஸ்",
      title: "அக்ரி வாய்ஸ் உதவியாளர்",
      subtitle: "செயற்கை நுண்ணறிவு வேளாண் வழிகாட்டி",
      listening: "கேட்கிறது... இப்போது பேசுங்கள்",
      click_to_speak: "பேச மைக்-ஐ அழுத்தவும்",
      tap_to_stop: "பதிவை நிறுத்த அழுத்தவும்",
      processing: "பதிலை சிந்திக்கிறது...",
      speaking: "பதிலை வாசிக்கிறது...",
      type_placeholder: "நெல், பூச்சி, உரம், அரசு திட்டங்கள் பற்றி கேளுங்கள்...",
      ask_btn: "அனுப்புக",
      stop_audio: "ஆடியோவை நிறுத்து",
      replay: "மீண்டும் கேள்",
      clear_chat: "அரட்டையை அழி",
      mic_not_supported: "இந்த உலாவியில் குரல் அறிதல் வசதி இல்லை. தயவுசெய்து தட்டச்சு செய்யவும்.",
      mic_permission_denied: "மைக் அணுகல் மறுக்கப்பட்டது. உலாவி அமைப்புகளில் மைக் அனுமதியை இயக்கவும்.",
      mic_error: "மைக் பிழை ஏற்பட்டது. மீண்டும் முயற்சி செய்யவும் அல்லது தட்டச்சு செய்யவும்.",
      privacy_note: "விவசாயி தனியுரிமை உறுதி: நீங்கள் பொத்தானை அழுத்தும்போது மட்டுமே மைக் செயல்படும்.",
      greeting: "வணக்கம்! நான் உங்கள் அக்ரிபிரிட்ஜ் குரல் உதவியாளர். உங்கள் விவசாயத்திற்கு நான் எவ்வாறு உதவ முடியும்? நெல் பூச்சிகள், குறுவை/சம்பா உர முறை, மண்டி விலை அல்லது அரசு திட்டங்கள் பற்றி கேட்கலாம்.",
      quick_prompts_title: "பரிந்துரைக்கப்பட்ட கேள்விகள்:",
      prompt_paddy_pest: "நெல்லில் தண்டு துளைப்பான் பூச்சியை எவ்வாறு கட்டுப்படுத்துவது?",
      prompt_kuruvai_fert: "குறுவை நெல் சாகுபடிக்கு சிறந்த உரம் எது?",
      prompt_schemes: "விவசாயிகளுக்கு என்ன தமிழ்நாடு அரசு திட்டங்கள் உள்ளன?",
      prompt_mandi_rates: "தற்போதைய விளைபொருள் மண்டி விலை நிலவரம் என்ன?",
      prompt_rhizome_rot: "மஞ்சளில் கிழங்கு அழுகல் நோயை தடுப்பது எப்படி?",
    },`,

  te: `    voice_assistant: {
      button_label: "అగ్రి వాయిస్",
      title: "అగ్రి వాయిస్ అసిస్టెంట్",
      subtitle: "రైతు ఏఐ వాయిస్ సలహాదారు",
      listening: "వింటోంది... ఇప్పుడు మాట్లాడండి",
      click_to_speak: "మాట్లాడటానికి మైక్ నొక్కండి",
      tap_to_stop: "రికార్డింగ్ ఆపడానికి నొక్కండి",
      processing: "సమాధానం విశ్లేషిస్తోంది...",
      speaking: "సమాధానం చదువుతోంది...",
      type_placeholder: "వరి, తెగుళ్ళు, ఎరువులు, పథకాల గురించి అడగండి...",
      ask_btn: "పంపు",
      stop_audio: "ఆడియో ఆపు",
      replay: "మళ్ళీ వినండి",
      clear_chat: "చాట్ క్లియర్ చేయి",
      mic_not_supported: "ఈ బ్రౌజర్‌లో వాయిస్ రికగ్నిషన్ సదుపాయం లేదు. దయచేసి టైప్ చేయండి.",
      mic_permission_denied: "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. బ్రౌజర్ సెట్టింగ్స్‌లో అనుమతించండి.",
      mic_error: "మైక్ ఎర్రర్ ఏర్పడింది. దయచేసి మళ్ళీ మాట్లాడండి లేదా టైప్ చేయండి.",
      privacy_note: "రైతు గోప్యత హామీ: మీరు బటన్ నొక్కినప్పుడు మాత్రమే మైక్ యాక్టివ్ అవుతుంది.",
      greeting: "నమస్కారం! నేను మీ అగ్రిబ్రిడ్జ్ వాయిస్ అసిస్టెంట్‌ని. మీ వ్యవసాయానికి ఎలా సహాయపడగలను? వరి సాగు, తెగుళ్ళు, ఎరువులు, ప్రభుత్వ పథకాల గురించి అడగండి.",
      quick_prompts_title: "సూచించిన ప్రశ్నలు:",
      prompt_paddy_pest: "వరిలో కాండం తొలుచు పురుగును ఎలా నివారించాలి?",
      prompt_kuruvai_fert: "వరి సాగుకు ఎరువుల షెడ్యూల్ ఏమిటి?",
      prompt_schemes: "రైతులకు ఏ ప్రభుత్వ పథకాలు అందుబాటులో ఉన్నాయి?",
      prompt_mandi_rates: "తాజా మార్కెట్ మరియు మండి ధరలు ఏమిటి?",
      prompt_rhizome_rot: "పసుపులో దుంప కుళ్ళు తెగులును ఎలా నివారించాలి?",
    },`,

  kn: `    voice_assistant: {
      button_label: "ಅಗ್ರಿ ವಾಯ್ಸ್",
      title: "ಅಗ್ರಿ ವಾಯ್ಸ್ ಸಹಾಯಕ",
      subtitle: "ಕೃಷಿ ಧ್ವನಿ ಸಲಹೆಗಾರ",
      listening: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
      click_to_speak: "ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿ",
      tap_to_stop: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಲು ಒತ್ತಿ",
      processing: "ಉತ್ತರವನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
      speaking: "ಉತ್ತರವನ್ನು ಓದುತ್ತಿದೆ...",
      type_placeholder: "ಭತ್ತ, ಕೀಟಗಳು, ಗೊಬ್ಬರಗಳು, ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
      ask_btn: "ಕಳುಹಿಸಿ",
      stop_audio: "ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ",
      replay: "ಮತ್ತೆ ಆಲಿಸಿ",
      clear_chat: "ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ",
      mic_not_supported: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಟೈಪ್ ಮಾಡಿ.",
      mic_permission_denied: "ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್ಸ್‌ಗಳಲ್ಲಿ ಸಕ್ರಿಯಗೊಳಿಸಿ.",
      mic_error: "ಮೈಕ್ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ.",
      privacy_note: "ರೈತರ ಗೌಪ್ಯತೆ ಭರವಸೆ: ನೀವು ಬಟನ್ ಒತ್ತಿದಾಗ ಮಾತ್ರ ಮೈಕ್ರೊಫೋನ್ ಸಕ್ರಿಯವಾಗಿರುತ್ತದೆ.",
      greeting: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಬ್ರಿಡ್ಜ್ ಧ್ವನಿ ಸಹಾಯಕ. ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲು ಸಿದ್ಧನಿದ್ದೇನೆ. ಭತ್ತದ ಕೃಷಿ, ಕೀಟ ನಿರ್ವಹಣೆ, ಮಾರುಕಟ್ಟೆ ದರಗಳ ಬಗ್ಗೆ ಕೇಳಿ.",
      quick_prompts_title: "ಶಿಫಾರಸು ಮಾಡಿದ ಪ್ರಶ್ನೆಗಳು:",
      prompt_paddy_pest: "ಭತ್ತದ ಬೆಳೆಯ ಕಾಂಡ ಕೊರೆಯುವ ಕೀಟವನ್ನು ನಿಯಂತ್ರಿಸುವುದು ಹೇಗೆ?",
      prompt_kuruvai_fert: "ಭತ್ತದ ಬೆಳೆಗೆ ಸೂಕ್ತ ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ ಎಷ್ಟು?",
      prompt_schemes: "ರೈತರಿಗೆ ಲಭ್ಯವಿರುವ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಯಾವುವು?",
      prompt_mandi_rates: "ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ದರಗಳು ಹೇಗಿವೆ?",
      prompt_rhizome_rot: "ಅರಿಶಿನದಲ್ಲಿ ಗಡ್ಡೆ ಕೊಳೆ ರೋಗವನ್ನು ತಡೆಗಟ್ಟುವುದು ಹೇಗೆ?",
    },`,

  ml: `    voice_assistant: {
      button_label: "അഗ്രി വോയ്സ്",
      title: "അഗ്രി വോയ്സ് അസിസ്റ്റന്റ്",
      subtitle: "കാർഷിക വോയ്സ് ഉപദേശകൻ",
      listening: "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കൂ",
      click_to_speak: "സംസാരിക്കാൻ മൈക്ക് അമർത്തുക",
      tap_to_stop: "റെക്കോർഡിംഗ് നിർത്താൻ അമർത്തുക",
      processing: "ഉത്തരം കണ്ടെത്തുന്നു...",
      speaking: "ഉത്തരം വായിക്കുന്നു...",
      type_placeholder: "നെല്ല്, രോഗങ്ങൾ, വളങ്ങൾ, പദ്ധതികൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ...",
      ask_btn: "അയക്കുക",
      stop_audio: "ഓഡിയോ നിർത്തുക",
      replay: "വീണ്ടും കേൾക്കുക",
      clear_chat: "ചാറ്റ് മായ്ക്കുക",
      mic_not_supported: "ഈ ബ്രൗസറിൽ വോയ്‌സ് തിരിച്ചറിയൽ ലഭ്യമല്ല. ദയവായി ടൈപ്പ് ചെയ്യുക.",
      mic_permission_denied: "മൈക്രോഫോൺ അനുമതി നിരസിച്ചു. ബ്രൗസർ സെറ്റിംഗ്സിൽ അനുമതി നൽകുക.",
      mic_error: "മൈക്ക് തകരാർ സംഭവിച്ചു. വീണ്ടും സംസാരിക്കുകയോ ടൈപ്പ് ചെയ്യുകയോ ചെയ്യുക.",
      privacy_note: "കർഷക സ്വകാര്യത ഉറപ്പ്: ബട്ടൺ അമർത്തുമ്പോൾ മാത്രമേ മൈക്രോഫോൺ പ്രവർത്തിക്കൂ.",
      greeting: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിബ്രിഡ്ജ് വോയ്‌സ് അസിസ്റ്റന്റാണ്. നിങ്ങളുടെ കൃഷി ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകാം. നെൽക്കൃഷി, കീടബാധ, സർക്കാർ പദ്ധതികൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.",
      quick_prompts_title: "ശുപാർശ ചെയ്യുന്ന ചോദ്യങ്ങൾ:",
      prompt_paddy_pest: "നെല്ലിലെ തണ്ടുതുരപ്പൻ പുഴുവിനെ എങ്ങനെ നിയന്ത്രിക്കാം?",
      prompt_kuruvai_fert: "നെൽക്കൃഷിക്ക് അനുയോജ്യമായ വളപ്രയോഗം ഏതാണ്?",
      prompt_schemes: "കർഷകർക്കായി എന്തൊക്കെ സർക്കാർ പദ്ധതികൾ ലഭ്യമാണ്?",
      prompt_mandi_rates: "വിപണിയിലെ ഏറ്റവും പുതിയ വിള വിലകൾ എന്തൊക്കെയാണ്?",
      prompt_rhizome_rot: "മഞ്ഞളിലെ കിഴങ്ങ് ചീയൽ രോഗം തടയുന്നത് എങ്ങനെ?",
    },`,

  hi: `    voice_assistant: {
      button_label: "एग्री वॉइस",
      title: "एग्री वॉइस सहायक",
      subtitle: "एआई कृषि वॉइस सलाहकार",
      listening: "सुन रहा है... अब बोलें",
      click_to_speak: "बोलने के लिए माइक दबाएं",
      tap_to_stop: "रिकॉर्डिंग रोकने के लिए टैप करें",
      processing: "कृषि डेटा का विश्लेषण हो रहा है...",
      speaking: "उत्तर पढ़ रहा है...",
      type_placeholder: "धान, कीट, उर्वरक, सरकारी योजनाओं के बारे में पूछें...",
      ask_btn: "भेजें",
      stop_audio: "ऑडियो रोकें",
      replay: "पुनः सुनें",
      clear_chat: "चैट साफ़ करें",
      mic_not_supported: "इस ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया प्रश्न टाइप करें।",
      mic_permission_denied: "माइक्रोफ़ोन अनुमति अस्वीकृत। कृपया ब्राउज़र सेटिंग्स में माइक की अनुमति दें।",
      mic_error: "माइक्रोफ़ोन त्रुटि हुई। कृपया दोबारा बोलें या टाइप करें।",
      privacy_note: "किसान गोपनीयता की गारंटी: माइक केवल आपके बटन दबाने पर ही सक्रिय होता है।",
      greeting: "नमस्ते! मैं आपका एग्रीब्रिज वॉइस सहायक हूँ। आज मैं आपकी खेती में क्या सहायता कर सकता हूँ? धान की बीमारियां, खाद का समय, मंडी भाव या सरकारी योजनाओं के बारे में पूछें।",
      quick_prompts_title: "सुझाए गए प्रश्न:",
      prompt_paddy_pest: "धान में तना छेदक (Stem Borer) कीट को कैसे नियंत्रित करें?",
      prompt_kuruvai_fert: "धान की फसल के लिए सर्वोत्तम उर्वरक अनुसूची क्या है?",
      prompt_schemes: "किसानों के लिए कौन सी सरकारी योजनाएं उपलब्ध हैं?",
      prompt_mandi_rates: "वर्तमान मंडी में उपज के भाव क्या हैं?",
      prompt_rhizome_rot: "हल्दी में कंद सड़न (Rhizome Rot) को कैसे रोकें?",
    },`,
};

// Check if already injected
if (content.includes("voice_assistant:")) {
  console.log("voice_assistant already present in translations.ts");
} else {
  // Replace each pattern of:
  //   admin_hub: "...",
  // },
  // with
  //   admin_hub: "...",
  // },
  // voice_assistant: { ... },

  const langs = ["en", "ta", "te", "kn", "ml", "hi"];
  let modified = content;

  // Find occurrences of admin_hub
  const regex = /(\s+admin_hub:\s*"[^"]*",\s*\n\s*\},)/g;
  let index = 0;
  modified = modified.replace(regex, (match) => {
    const lang = langs[index];
    index++;
    if (lang && voiceTranslations[lang]) {
      return `${match}\n${voiceTranslations[lang]}`;
    }
    return match;
  });

  if (index === 6) {
    fs.writeFileSync(filePath, modified, "utf-8");
    console.log("Successfully injected voice_assistant into all 6 languages in translations.ts!");
  } else {
    console.error(`Expected 6 replacements, but found ${index}`);
    process.exit(1);
  }
}
