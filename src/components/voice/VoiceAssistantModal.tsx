"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Radio,
  ChevronDown,
  Trash2,
  Settings,
  Sliders,
  Play,
  Pause,
  Square,
  ExternalLink,
  Video,
  CheckCircle2,
  Globe,
  Info,
  BookOpen,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { Locale, translations } from "@/lib/i18n/translations";
import { VideoExplanation } from "@/lib/agricultureVideos";
import { SourceCitation } from "@/lib/ai/farmingAssistant";
import { voicePlayer, getAvailableVoiceProfiles, VoiceProfileOption } from "@/lib/voice/voiceService";

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  spokenText?: string;
  timestamp: string;
  topic?: string;
  sources?: SourceCitation[];
  clarifyingQuestion?: string | null;
  followUps?: string[];
  youtubeSearchQuery?: string;
  youtubeSearchUrl?: string;
  videos?: VideoExplanation[];
  provider?: "gemini" | "openai" | "knowledge-base";
}

const SUPPORTED_LANGUAGES: { code: Locale; name: string; nativeName: string; speechTag: string }[] = [
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", speechTag: "ta-IN" },
  { code: "en", name: "English", nativeName: "English (India)", speechTag: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", speechTag: "hi-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", speechTag: "te-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", speechTag: "kn-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", speechTag: "ml-IN" },
];

const LOCALE_TO_SPEECH_TAG: Record<Locale, string> = {
  en: "en-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  hi: "hi-IN",
};

interface VoicePreferences {
  inputLanguage: Locale;
  responseLanguage: Locale;
  speechRate: number;
  autoRead: boolean;
  selectedVoiceURI: string | null;
}

const STORAGE_KEY = "agribridge_voice_prefs_v3";

export function VoiceAssistantModal() {
  const { locale: siteLocale, t } = useI18n();
  const vt = t.voice_assistant;

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Independent language states
  const [inputLanguage, setInputLanguage] = useState<Locale>(siteLocale);
  const [responseLanguage, setResponseLanguage] = useState<Locale>(siteLocale);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoRead, setAutoRead] = useState<boolean>(true);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>("cloud:neural");

  // Voice profiles available for active responseLanguage
  const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfileOption[]>([]);
  const [voiceWarning, setVoiceWarning] = useState<string | null>(null);

  // Messages & conversation
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active expanded video player map (videoId -> boolean)
  const [expandedVideos, setExpandedVideos] = useState<Record<string, boolean>>({});

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Partial<VoicePreferences> = JSON.parse(saved);
        if (parsed.inputLanguage) setInputLanguage(parsed.inputLanguage);
        if (parsed.responseLanguage) setResponseLanguage(parsed.responseLanguage);
        if (typeof parsed.speechRate === "number") setSpeechRate(parsed.speechRate);
        if (typeof parsed.autoRead === "boolean") setAutoRead(parsed.autoRead);
        if (parsed.selectedVoiceURI) setSelectedVoiceURI(parsed.selectedVoiceURI);
      } else {
        setInputLanguage(siteLocale);
        setResponseLanguage(siteLocale);
      }
    } catch {
      setInputLanguage(siteLocale);
      setResponseLanguage(siteLocale);
    }
  }, [siteLocale]);

  // 2. Persist preferences whenever they change
  useEffect(() => {
    try {
      const prefs: VoicePreferences = {
        inputLanguage,
        responseLanguage,
        speechRate,
        autoRead,
        selectedVoiceURI,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // LocalStorage error ignored
    }
  }, [inputLanguage, responseLanguage, speechRate, autoRead, selectedVoiceURI]);

  // 3. Update voice profiles when responseLanguage changes or browser voices populate
  const refreshVoices = useCallback(() => {
    const profiles = getAvailableVoiceProfiles(responseLanguage);
    setVoiceProfiles(profiles);

    // Validate if current selected voice exists in available profiles
    const isValid = profiles.some((p) => p.id === selectedVoiceURI);
    if (!isValid) {
      // Default to Cloud Neural or first profile
      setSelectedVoiceURI(profiles[0]?.id || "cloud:neural");
    }

    if (profiles.length === 0) {
      setVoiceWarning(vt.no_voice_warning);
    } else {
      setVoiceWarning(null);
    }
  }, [responseLanguage, selectedVoiceURI, vt.no_voice_warning]);

  useEffect(() => {
    refreshVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }

    const SpeechRecognition =
      typeof window !== "undefined"
        ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, [refreshVoices]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      voicePlayer.stop(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  // Handler for response language change with audio reset and greeting localization
  const handleResponseLanguageChange = (newLocale: Locale) => {
    voicePlayer.stop(false);
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveSpeakingId(null);
    setResponseLanguage(newLocale);

    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome-1") {
        const localizedVt = translations[newLocale]?.voice_assistant || vt;
        return [
          {
            id: "welcome-1",
            sender: "assistant",
            text: localizedVt.greeting,
            spokenText: localizedVt.greeting,
            timestamp: prev[0].timestamp,
            followUps: [
              localizedVt.prompt_paddy_pest,
              localizedVt.prompt_kuruvai_fert,
              localizedVt.prompt_schemes,
              localizedVt.prompt_mandi_rates,
            ],
          },
        ];
      }
      return prev;
    });
  };

  const handleInputLanguageChange = (newLocale: Locale) => {
    stopListening();
    setInputLanguage(newLocale);
  };

  // 4. Initialize greeting message when modal is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const localizedVt = translations[responseLanguage]?.voice_assistant || vt;
      setMessages([
        {
          id: "welcome-1",
          sender: "assistant",
          text: localizedVt.greeting,
          spokenText: localizedVt.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          followUps: [
            localizedVt.prompt_paddy_pest,
            localizedVt.prompt_kuruvai_fert,
            localizedVt.prompt_schemes,
            localizedVt.prompt_mandi_rates,
          ],
        },
      ]);
    }
  }, [isOpen, responseLanguage, vt]);

  // 5. Scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, interimTranscript, isOpen, isLoading]);

  // 6. Stop listening and speaking on close
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      setShowSettings(false);
      setShowClearConfirm(false);
    }
  }, [isOpen]);

  // 7. Multi-provider Speech Playback (Browser SpeechSynthesis + High-Quality Backend TTS)
  const speakText = (text: string, messageId?: string) => {
    if (!soundEnabled) return;

    voicePlayer.stop();
    setIsPaused(false);

    voicePlayer.play(
      text,
      {
        locale: responseLanguage,
        voiceId: selectedVoiceURI,
        speed: speechRate,
      },
      {
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
          if (messageId) setActiveSpeakingId(messageId);
        },
        onPause: () => {
          setIsPaused(true);
        },
        onResume: () => {
          setIsPaused(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          setActiveSpeakingId(null);
        },
        onError: (err) => {
          console.warn("Speech playback notice:", err);
          setIsSpeaking(false);
          setIsPaused(false);
          setActiveSpeakingId(null);
        },
      }
    );
  };

  const pauseSpeaking = () => {
    voicePlayer.pause();
    setIsPaused(true);
  };

  const resumeSpeaking = () => {
    voicePlayer.resume();
    setIsPaused(false);
  };

  const stopSpeaking = () => {
    voicePlayer.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveSpeakingId(null);
  };

  // 8. Speech-to-Text Recognition using selected inputLanguage
  const startListening = () => {
    setMicError(null);
    stopSpeaking();

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicError(vt.mic_not_supported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = LOCALE_TO_SPEECH_TAG[inputLanguage] || "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalTranscript) {
          setIsListening(false);
          setInterimTranscript("");
          handleSendMessage(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        setInterimTranscript("");
        if (event.error === "not-allowed" || event.error === "permission-denied") {
          setMicError(vt.mic_permission_denied);
        } else if (event.error !== "no-speech") {
          setMicError(vt.mic_error);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error("Speech recognition start failed:", err);
      setIsListening(false);
      setMicError(vt.mic_error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore if already stopped
      }
      setIsListening(false);
      setInterimTranscript("");
    }
  };

  // 9. Send message to AI Assistant API with multi-turn conversation history
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setInterimTranscript("");
    setIsLoading(true);
    setMicError(null);

    // Build context history (exclude welcome greeting, take last 4 messages for precision)
    const historyPayload = messages
      .filter((m) => m.id !== "welcome-1")
      .slice(-4)
      .map((m) => ({
        role: m.sender,
        content: m.text,
      }));

    try {
      const response = await fetch("/api/intelligence/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          locale: responseLanguage,
          inputLocale: inputLanguage,
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive response from agricultural assistant");
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: "ai-" + Date.now(),
        sender: "assistant",
        text: data.answer,
        spokenText: data.spokenText || data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        topic: data.topic,
        sources: data.sources || [],
        clarifyingQuestion: data.clarifyingQuestion || null,
        followUps: data.suggestedFollowUps || [],
        youtubeSearchQuery: data.youtubeSearchQuery || "",
        youtubeSearchUrl: data.youtubeSearchUrl || "",
        videos: data.videos || [],
        provider: data.provider || "knowledge-base",
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Auto-read response if enabled
      if (soundEnabled && autoRead) {
        speakText(assistantMsg.spokenText || assistantMsg.text, assistantMsg.id);
      }
    } catch (err: any) {
      console.error("Voice assistant query error:", err);
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        sender: "assistant",
        text: "Sorry, I encountered an issue connecting to the agricultural database. Please check your network and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle video accordion embed
  const toggleVideoExpand = (videoId: string) => {
    setExpandedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  return (
    <>
      {/* 1. FLOATING MICROPHONE TRIGGER BUTTON */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border-2 ${
            isOpen
              ? "bg-[#1e4731] border-[#388e5d] ring-4 ring-[#24593c]/30"
              : "bg-[#24593c] border-[#388e5d] hover:bg-[#1e4731]"
          }`}
          aria-label={vt.title}
          title={vt.title}
        >
          <div className="relative">
            <Mic className="w-5 h-5 text-emerald-200" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-300"></span>
            </span>
          </div>
          <span className="font-bold text-xs tracking-wide pr-1 hidden sm:inline">
            {vt.button_label}
          </span>
          <span className="text-[10px] font-semibold bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded uppercase">
            {inputLanguage}
          </span>
        </button>
      </div>

      {/* 2. MODERN VOICE ASSISTANT MODAL / PANEL */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={vt.title}
          className="fixed bottom-20 sm:bottom-22 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] max-h-[85vh] h-[680px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#24593c] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0 shadow-sm border-b border-[#1e4731]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1e4731] border border-emerald-400/40 flex items-center justify-center text-emerald-200 shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-sm tracking-tight text-white">{vt.title}</h3>
                  <span className="text-[10px] font-bold bg-emerald-950/70 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30">
                    {inputLanguage.toUpperCase()} 🎙️ → {responseLanguage.toUpperCase()} 🔊
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 leading-none mt-0.5">
                  {vt.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Settings Panel Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1.5 rounded-md transition-colors ${
                  showSettings ? "bg-[#1e4731] text-emerald-300 ring-1 ring-emerald-400" : "text-emerald-100 hover:bg-[#1e4731] hover:text-white"
                }`}
                title={vt.settings_title}
                aria-label={vt.settings_title}
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Sound Mute Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setSoundEnabled(!soundEnabled);
                }}
                className="p-1.5 rounded-md hover:bg-[#1e4731] text-emerald-100 hover:text-white transition-colors"
                title={soundEnabled ? "Mute Spoken Audio" : "Enable Spoken Audio"}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                )}
              </button>

              {/* Clear History */}
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-1.5 rounded-md hover:bg-[#1e4731] text-emerald-100 hover:text-white transition-colors"
                title={vt.clear_chat}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-md hover:bg-[#1e4731] text-emerald-100 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clear Chat Confirmation Modal Overlay */}
          {showClearConfirm && (
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-stone-800 flex items-center justify-between text-xs animate-in fade-in duration-150">
              <span className="font-medium text-amber-900 pr-2">{vt.clear_confirm}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    stopSpeaking();
                    setMessages([]);
                    setShowClearConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-[11px]"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-2.5 py-1 bg-stone-200 text-stone-700 rounded font-semibold hover:bg-stone-300 text-[11px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* VOICE SETTINGS PANEL */}
          {showSettings && (
            <div className="bg-stone-50 border-b border-stone-200 p-3.5 space-y-3 text-xs animate-in slide-in-from-top duration-200 overflow-y-auto max-h-[300px]">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{vt.settings_title}</span>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-stone-400 hover:text-stone-600 text-[11px]"
                >
                  ✕ Close
                </button>
              </div>

              {/* Language Selection Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    🎙️ {vt.input_language}
                  </label>
                  <select
                    value={inputLanguage}
                    onChange={(e) => handleInputLanguageChange(e.target.value as Locale)}
                    className="w-full text-xs p-1.5 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.nativeName} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    🔊 {vt.response_language}
                  </label>
                  <select
                    value={responseLanguage}
                    onChange={(e) => handleResponseLanguageChange(e.target.value as Locale)}
                    className="w-full text-xs p-1.5 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.nativeName} ({l.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Voice Profile Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  🗣️ {vt.voice_select}
                </label>
                {voiceProfiles.length > 0 ? (
                  <select
                    value={selectedVoiceURI || "cloud:neural"}
                    onChange={(e) => setSelectedVoiceURI(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    {voiceProfiles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.type === "cloud" ? "🌐 " : "💻 "} {v.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800">
                    ⚠️ {vt.no_voice_warning}
                  </div>
                )}
                <p className="text-[10px] text-stone-400 mt-1">
                  🌐 Cloud Neural Voice provides high-definition audio across all 6 Indian languages.
                </p>
              </div>

              {/* Speech Speed (Rate) Selection */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  ⚡ {vt.speech_speed}: <span className="text-emerald-700 font-bold">{speechRate}x</span>
                </label>
                <div className="flex gap-1.5">
                  {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSpeechRate(rate)}
                      className={`flex-1 py-1 rounded text-center text-[11px] font-semibold transition-all border ${
                        speechRate === rate
                          ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                          : "bg-white text-stone-700 border-stone-300 hover:bg-stone-100"
                      }`}
                    >
                      {`${rate}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-read Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-stone-700">{vt.auto_read}</span>
                <button
                  type="button"
                  onClick={() => setAutoRead(!autoRead)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoRead ? "bg-emerald-700" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      autoRead ? "translate-x-4.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Voice Warning Banner */}
          {voiceWarning && (
            <div className="p-2.5 bg-amber-50 border-b border-amber-200 flex items-start gap-2 text-[11px] text-amber-900 shrink-0">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{voiceWarning}</span>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fbfbfa] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#24593c] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 shadow-2xs ${
                    msg.sender === "user"
                      ? "bg-[#24593c] text-white rounded-tr-xs"
                      : "bg-white text-stone-800 border border-stone-200 rounded-tl-xs"
                  }`}
                >
                  {/* Topic & Provider Header */}
                  {msg.topic && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{msg.topic}</span>
                      </div>
                      {msg.provider && (
                        <span className="text-[9px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                          {msg.provider === "gemini" ? "Google Gemini AI" : msg.provider === "openai" ? "OpenAI GPT" : "TNAU Grounded Engine"}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-line leading-relaxed text-xs">
                    {msg.text}
                  </div>

                  {/* Clarifying Question Block */}
                  {msg.clarifyingQuestion && (
                    <div className="mt-2.5 p-2 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2 text-[11px] text-amber-900 animate-in fade-in">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-semibold">{msg.clarifyingQuestion}</span>
                      </div>
                      <button
                        onClick={() => {
                          setInputText(msg.clarifyingQuestion + ": ");
                          inputRef.current?.focus();
                        }}
                        className="text-[10px] bg-amber-200/70 hover:bg-amber-300 text-amber-950 font-bold px-2 py-0.5 rounded transition-colors shrink-0"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Sources Citation Footer */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 flex-wrap text-[10px] text-stone-500">
                      <span className="font-semibold text-stone-700 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-emerald-700" />
                        <span>Sources:</span>
                      </span>
                      {msg.sources.map((src, i) => (
                        <span key={i} className="bg-stone-50 px-1.5 py-0.5 rounded text-stone-600 border border-stone-200/80">
                          {src.title} ({src.organization})
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 4. WATCH VIDEO EXPLANATION SECTION */}
                  {msg.videos && msg.videos.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                          <Video className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{vt.watch_video}</span>
                        </div>
                        {msg.youtubeSearchUrl && (
                          <a
                            href={msg.youtubeSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-stone-500 hover:text-emerald-800 flex items-center gap-0.5 font-medium"
                          >
                            <span>More on YouTube</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div className="space-y-2">
                        {msg.videos.map((vid) => {
                          const isExpanded = !!expandedVideos[vid.id];
                          return (
                            <div
                              key={vid.id}
                              className="border border-emerald-100 bg-emerald-50/40 rounded-xl p-2.5 transition-all"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-900 border border-stone-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={vid.thumbnailUrl}
                                    alt={vid.title}
                                    className="w-full h-full object-cover"
                                  />
                                  <button
                                    onClick={() => toggleVideoExpand(vid.id)}
                                    className="absolute inset-0 bg-black/35 hover:bg-black/20 flex items-center justify-center text-white transition-all"
                                    title="Play Video"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-emerald-600/90 flex items-center justify-center">
                                      <Play className="w-3 h-3 fill-white ml-0.5" />
                                    </div>
                                  </button>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-[11px] text-stone-900 leading-snug line-clamp-2">
                                    {vid.title}
                                  </h4>
                                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-stone-500 flex-wrap">
                                    <span className="font-semibold text-emerald-800 flex items-center gap-0.5">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                      {vid.channelTitle}
                                    </span>
                                    <span>•</span>
                                    <span className="bg-stone-100 px-1.5 py-0.2 rounded text-stone-600">
                                      {vid.language}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-emerald-100/60 text-[10px]">
                                <button
                                  onClick={() => toggleVideoExpand(vid.id)}
                                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                                >
                                  <span>{isExpanded ? "Hide Player ▲" : "▶ Watch Here"}</span>
                                </button>

                                <a
                                  href={vid.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-stone-500 hover:text-emerald-800 flex items-center gap-1 font-medium"
                                >
                                  <span>{vt.watch_on_youtube}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>

                              {isExpanded && (
                                <div className="mt-2.5 rounded-lg overflow-hidden border border-emerald-200 shadow-sm bg-black animate-in fade-in duration-200">
                                  <iframe
                                    src={`${vid.embedUrl}?autoplay=1`}
                                    title={vid.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full aspect-video"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Audio Controls and Timestamp Footer */}
                  <div
                    className={`flex items-center justify-between mt-2 pt-1.5 text-[10px] border-t ${
                      msg.sender === "user"
                        ? "border-emerald-700/50 text-emerald-200"
                        : "border-stone-100 text-stone-400"
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {msg.sender === "assistant" && (
                      <div className="flex items-center gap-2">
                        {activeSpeakingId === msg.id && isSpeaking ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={isPaused ? resumeSpeaking : pauseSpeaking}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100"
                              title={isPaused ? vt.resume : vt.pause}
                            >
                              {isPaused ? <Play className="w-2.5 h-2.5 fill-emerald-700" /> : <Pause className="w-2.5 h-2.5 fill-emerald-700" />}
                              <span>{isPaused ? vt.resume : vt.pause}</span>
                            </button>

                            <button
                              onClick={stopSpeaking}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-semibold hover:bg-red-100"
                              title={vt.stop}
                            >
                              <Square className="w-2.5 h-2.5 fill-red-600" />
                              <span>{vt.stop}</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (activeSpeakingId === msg.id && isSpeaking) {
                                stopSpeaking();
                              } else {
                                speakText(msg.spokenText || msg.text, msg.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                            title={vt.replay}
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{vt.replay}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-up Inquiries */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-stone-100">
                      <p className="text-[10px] font-semibold text-stone-500 mb-1.5">
                        {vt.quick_prompts_title}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followUps.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(prompt)}
                            className="text-left text-[11px] bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 rounded-lg px-2.5 py-1 text-stone-700 transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Live Voice Interim Feedback */}
            {isListening && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-60"></span>
                  <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white relative z-10">
                    <Mic className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-emerald-900">{vt.listening}</p>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded font-semibold">
                      {inputLanguage.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 italic">
                    {interimTranscript || vt.click_to_speak}
                  </p>
                </div>
                <button
                  onClick={stopListening}
                  className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[10px] font-semibold hover:bg-emerald-800"
                >
                  Done
                </button>
              </div>
            )}

            {/* Assistant Loading State */}
            {isLoading && (
              <div className="flex items-center gap-2 text-stone-500 p-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                  <span className="ml-1 text-[11px]">{vt.processing}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {micError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-[11px] text-red-700">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{micError}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ACTIVE AUDIO CONTROLS FLOATING BAR */}
          {isSpeaking && (
            <div className="bg-emerald-900 text-white px-3 py-1.5 flex items-center justify-between text-[11px] shrink-0 border-t border-emerald-800 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
                </span>
                <span className="font-medium text-emerald-100 truncate">
                  {isPaused ? "Audio Paused" : vt.speaking} ({responseLanguage.toUpperCase()})
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={isPaused ? resumeSpeaking : pauseSpeaking}
                  className="px-2 py-0.5 bg-emerald-800 hover:bg-emerald-700 rounded text-emerald-100 font-semibold flex items-center gap-1 text-[10px]"
                >
                  {isPaused ? <Play className="w-2.5 h-2.5 fill-white" /> : <Pause className="w-2.5 h-2.5 fill-white" />}
                  <span>{isPaused ? vt.resume : vt.pause}</span>
                </button>
                <button
                  onClick={stopSpeaking}
                  className="px-2 py-0.5 bg-red-700 hover:bg-red-600 rounded text-white font-semibold flex items-center gap-1 text-[10px]"
                >
                  <Square className="w-2.5 h-2.5 fill-white" />
                  <span>{vt.stop}</span>
                </button>
              </div>
            </div>
          )}

          {/* Bottom Voice & Text Input Section */}
          <div className="p-3 bg-white border-t border-stone-200 shrink-0 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse ring-4 ring-red-200"
                    : "bg-[#24593c] text-white hover:bg-[#1e4731]"
                }`}
                title={isListening ? vt.tap_to_stop : `${vt.click_to_speak} (${inputLanguage.toUpperCase()})`}
                aria-label={isListening ? vt.tap_to_stop : vt.click_to_speak}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={vt.type_placeholder}
                disabled={isLoading || isListening}
                className="flex-1 px-3.5 py-2 text-xs border border-stone-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#24593c] bg-stone-50 focus:bg-white transition-colors"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-9 h-9 rounded-full bg-[#24593c] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1e4731] transition-colors shrink-0"
                title={vt.ask_btn}
                aria-label={vt.ask_btn}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[10px] text-stone-400 text-center flex items-center justify-center gap-1">
              <span>🔒 {vt.privacy_note}</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
