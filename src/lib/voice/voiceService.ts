"use client";

import { Locale } from "@/lib/i18n/translations";
import { normalizeTextForSpeech, EXACT_BCP47_TAGS } from "@/lib/voice/speechNormalization";

export { normalizeTextForSpeech, EXACT_BCP47_TAGS };

export interface VoiceProfileOption {
  id: string;
  name: string;
  bcp47: string;
  type: "cloud" | "browser";
  voice?: SpeechSynthesisVoice;
}

export interface PlayOptions {
  locale: Locale;
  voiceId?: string | null;
  speed?: number;
}

export interface VoiceCallbacks {
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

const LANGUAGE_DISPLAY_NAMES: Record<Locale, string> = {
  ta: "தமிழ் (Tamil)",
  en: "English (India)",
  hi: "हिन्दी (Hindi)",
  te: "తెలుగు (Telugu)",
  kn: "ಕನ್ನಡ (Kannada)",
  ml: "മലയാളം (Malayalam)",
};

/**
 * Get unified voice profiles strictly matching the target language's BCP-47 tag.
 * NEVER pairs an incompatible language voice with the selected language.
 */
export function getAvailableVoiceProfiles(locale: Locale): VoiceProfileOption[] {
  const options: VoiceProfileOption[] = [];
  const bcp47 = EXACT_BCP47_TAGS[locale] || "en-IN";
  const displayName = LANGUAGE_DISPLAY_NAMES[locale] || locale.toUpperCase();

  // 1. Cloud Neural Voice is primary for Indian languages, guaranteeing authentic native speech
  options.push({
    id: "cloud:neural",
    name: `Cloud Neural Voice (${displayName})`,
    bcp47,
    type: "cloud",
  });

  // 2. Query browser voices and STRICTLY filter for exact language match
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const rawVoices = window.speechSynthesis.getVoices();
    const exactTagLower = bcp47.toLowerCase();
    const langCodeLower = locale.toLowerCase();

    const matchingBrowserVoices = rawVoices.filter((v) => {
      const vl = v.lang.toLowerCase().replace(/_/g, "-");
      // Must match exact BCP-47 (e.g. 'ta-in') or begin with language code + '-' (e.g. 'ta-lk')
      return vl === exactTagLower || vl.startsWith(langCodeLower + "-");
    });

    for (const v of matchingBrowserVoices) {
      options.push({
        id: `browser:${v.voiceURI}`,
        name: `${v.name} (${v.lang})`,
        bcp47: v.lang,
        type: "browser",
        voice: v,
      });
    }
  }

  return options;
}

/**
 * Robust Voice Player Service
 * Guarantees that EXACTLY ONE TTS engine speaks at any time.
 * Handles aborting in-flight requests, session tokens to prevent race conditions,
 * and clean isolation between browser Web Speech and backend audio.
 */
class VoicePlayerService {
  private activeMode: "idle" | "browser" | "cloud" = "idle";
  private currentSessionId = 0;
  private audioEl: HTMLAudioElement | null = null;
  private currentBlobUrl: string | null = null;
  private abortController: AbortController | null = null;
  private callbacks: VoiceCallbacks = {};
  private currentRate = 1.0;

  /**
   * Stop any active playback immediately.
   * Cancels browser synthesis, aborts any in-flight cloud fetch,
   * stops audio elements, and resets session tracking.
   */
  public stop(notifyEnd = true) {
    // Increment session ID to invalidate any pending async callbacks
    this.currentSessionId++;

    // Abort any pending fetch
    if (this.abortController) {
      try {
        this.abortController.abort();
      } catch {
        // Ignore abort errors
      }
      this.abortController = null;
    }

    // Cancel browser synthesis twice to handle WebKit / Blink queue bugs
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      } catch (err) {
        console.warn("SpeechSynthesis cancel notice:", err);
      }
    }

    // Stop cloud audio element
    if (this.audioEl) {
      try {
        this.audioEl.onplay = null;
        this.audioEl.onended = null;
        this.audioEl.onerror = null;
        this.audioEl.onpause = null;
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
        this.audioEl.src = "";
      } catch (err) {
        console.warn("Audio element pause notice:", err);
      }
      this.audioEl = null;
    }

    // Clean up blob URL
    if (this.currentBlobUrl) {
      try {
        URL.revokeObjectURL(this.currentBlobUrl);
      } catch {
        // Ignore
      }
      this.currentBlobUrl = null;
    }

    const wasActive = this.activeMode !== "idle";
    this.activeMode = "idle";

    if (wasActive && notifyEnd && this.callbacks.onEnd) {
      try {
        this.callbacks.onEnd();
      } catch {
        // Ignore callback error
      }
    }
  }

  /**
   * Pause active playback
   */
  public pause() {
    if (this.activeMode === "browser" && typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.pause();
      } catch {
        // Ignore
      }
      if (this.callbacks.onPause) this.callbacks.onPause();
    } else if (this.activeMode === "cloud" && this.audioEl) {
      try {
        this.audioEl.pause();
      } catch {
        // Ignore
      }
      if (this.callbacks.onPause) this.callbacks.onPause();
    }
  }

  /**
   * Resume paused playback
   */
  public resume() {
    if (this.activeMode === "browser" && typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.resume();
      } catch {
        // Ignore
      }
      if (this.callbacks.onResume) this.callbacks.onResume();
    } else if (this.activeMode === "cloud" && this.audioEl) {
      this.audioEl.play().catch((err) => {
        console.warn("Audio resume notice:", err);
      });
      if (this.callbacks.onResume) this.callbacks.onResume();
    }
  }

  /**
   * Play speech safely. Cancels all prior speech, normalizes text into the selected language,
   * and routes to EXACTLY ONE engine.
   */
  public async play(text: string, options: PlayOptions, callbacks: VoiceCallbacks = {}) {
    // 1. Fully stop any existing playback and invalidate prior sessions
    this.stop(false);

    const sessionId = ++this.currentSessionId;
    this.callbacks = callbacks;
    this.currentRate = options.speed || 1.0;

    const normalized = normalizeTextForSpeech(text, options.locale);
    if (!normalized) return;

    // 2. Resolve target voice profile
    const profiles = getAvailableVoiceProfiles(options.locale);
    const chosenProfile = profiles.find((p) => p.id === options.voiceId) || profiles[0];

    // 3. Route to Browser SpeechSynthesis ONLY if explicitly chosen AND matching exact BCP-47
    if (
      chosenProfile &&
      chosenProfile.type === "browser" &&
      chosenProfile.voice &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      this.playBrowserTTS(normalized, chosenProfile.voice, options.locale, sessionId);
      return;
    }

    // 4. Otherwise, use Cloud Backend TTS exclusively (prevents wrong-accent browser mixing)
    await this.playCloudTTS(normalized, options.locale, sessionId);
  }

  private playBrowserTTS(
    text: string,
    voice: SpeechSynthesisVoice,
    locale: Locale,
    sessionId: number
  ) {
    if (this.currentSessionId !== sessionId) return;

    this.activeMode = "browser";
    const bcp47 = EXACT_BCP47_TAGS[locale] || "en-IN";

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = bcp47;
    utterance.rate = this.currentRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (this.currentSessionId !== sessionId) return;
      if (this.callbacks.onStart) this.callbacks.onStart();
    };

    utterance.onend = () => {
      if (this.currentSessionId !== sessionId) return;
      this.activeMode = "idle";
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };

    utterance.onerror = (e) => {
      if (this.currentSessionId !== sessionId) return;
      if (e.error !== "interrupted" && e.error !== "canceled") {
        console.warn("Browser SpeechSynthesis notice:", e);
        if (this.callbacks.onError) this.callbacks.onError(new Error(e.error));
      }
      this.activeMode = "idle";
      if (this.callbacks.onEnd) this.callbacks.onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  private async playCloudTTS(text: string, locale: Locale, sessionId: number) {
    if (this.currentSessionId !== sessionId) return;

    this.activeMode = "cloud";
    this.abortController = new AbortController();

    try {
      const response = await fetch("/api/intelligence/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          locale,
          speed: this.currentRate,
        }),
        signal: this.abortController.signal,
      });

      // Verify session is still valid after network round-trip
      if (this.currentSessionId !== sessionId) return;

      if (!response.ok) {
        throw new Error(`Cloud TTS synthesis failed: HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      if (this.currentSessionId !== sessionId) return;

      const blobUrl = URL.createObjectURL(audioBlob);
      this.currentBlobUrl = blobUrl;

      const audio = new Audio(blobUrl);
      this.audioEl = audio;
      audio.playbackRate = this.currentRate;

      audio.onplay = () => {
        if (this.currentSessionId !== sessionId) return;
        if (this.callbacks.onStart) this.callbacks.onStart();
      };

      audio.onended = () => {
        if (this.currentSessionId !== sessionId) return;
        this.activeMode = "idle";
        this.audioEl = null;
        if (this.currentBlobUrl) {
          URL.revokeObjectURL(this.currentBlobUrl);
          this.currentBlobUrl = null;
        }
        if (this.callbacks.onEnd) this.callbacks.onEnd();
      };

      audio.onerror = () => {
        if (this.currentSessionId !== sessionId) return;
        console.warn("Cloud Audio playback error");
        this.activeMode = "idle";
        this.audioEl = null;
        if (this.callbacks.onError) this.callbacks.onError(new Error("Audio playback failed"));
      };

      await audio.play();
    } catch (err: any) {
      if (this.currentSessionId !== sessionId) return;
      if (err.name === "AbortError") return;

      console.warn("Cloud TTS playback notice:", err.message);
      this.activeMode = "idle";
      if (this.callbacks.onError) {
        this.callbacks.onError(err);
      }
    }
  }
}

export const voicePlayer = new VoicePlayerService();
