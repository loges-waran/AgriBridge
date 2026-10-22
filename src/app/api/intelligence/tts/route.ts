import { NextRequest, NextResponse } from "next/server";
import { normalizeTextForSpeech } from "@/lib/voice/speechNormalization";
import { Locale } from "@/lib/i18n/translations";

export const dynamic = "force-dynamic";

const LOCALE_TO_TTS_LANG: Record<string, string> = {
  ta: "ta",
  en: "en-IN",
  hi: "hi",
  te: "te",
  kn: "kn",
  ml: "ml",
};

/**
 * Split text into natural sentence chunks respecting sentence boundaries
 * and maximum query length for TTS synthesis (~170 chars).
 */
function splitTextIntoChunks(text: string, maxLength = 170): string[] {
  if (!text) return [];

  // Split by sentence terminators
  const sentences = text.match(/[^.!?।\n]+[.!?।\n]*/g) || [text];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    if ((current + " " + trimmed).trim().length <= maxLength) {
      current = (current + " " + trimmed).trim();
    } else {
      if (current) chunks.push(current);

      if (trimmed.length <= maxLength) {
        current = trimmed;
      } else {
        // Break long sentence by spaces or commas
        const phrases = trimmed.split(/([,;:\s]+)/);
        let sub = "";
        for (const p of phrases) {
          if ((sub + p).length <= maxLength) {
            sub += p;
          } else {
            if (sub.trim()) chunks.push(sub.trim());
            sub = p.trim();
          }
        }
        current = sub.trim();
      }
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

/**
 * Fetch a single audio chunk from the Google Translate TTS service
 */
async function fetchTTSChunk(text: string, langCode: string, speed = 1.0): Promise<Buffer | null> {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(text)}&ttsspeed=${speed < 1 ? "0.5" : "1"}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
        "Referer": "https://translate.google.com/",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
  } catch (err: any) {
    console.warn(`TTS chunk fetch notice for [${langCode}]:`, err.message);
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText = (body.text || "").trim();
    const rawLocale = (body.locale || "en").toLowerCase() as Locale;
    const speed = typeof body.speed === "number" ? body.speed : 1.0;

    const langCode = LOCALE_TO_TTS_LANG[rawLocale] || (rawLocale.startsWith("ta") ? "ta" : "en-IN");

    if (!rawText) {
      return NextResponse.json({ error: "Text is required for TTS synthesis" }, { status: 400 });
    }

    // 1. Normalize abbreviations, dosages, and symbols strictly into the selected language
    const normalizedText = normalizeTextForSpeech(rawText, rawLocale);
    if (!normalizedText) {
      return NextResponse.json({ error: "Empty normalized speech text" }, { status: 400 });
    }

    // 2. Chunk text into natural sentences
    const chunks = splitTextIntoChunks(normalizedText);
    if (chunks.length === 0) {
      return NextResponse.json({ error: "Empty speech chunks" }, { status: 400 });
    }

    // 3. Fetch audio chunks sequentially to maintain chronological sentence continuity
    const limitedChunks = chunks.slice(0, 8);
    const audioBuffers: Buffer[] = [];

    for (const chunk of limitedChunks) {
      const buf = await fetchTTSChunk(chunk, langCode, speed);
      if (buf && buf.length > 0) {
        audioBuffers.push(buf);
      }
    }

    if (audioBuffers.length === 0) {
      return NextResponse.json(
        { error: `Cloud TTS is temporarily unavailable for language: ${rawLocale}` },
        { status: 502 }
      );
    }

    // 4. Concatenate and return single unified audio stream
    const combinedAudio = Buffer.concat(audioBuffers);

    return new NextResponse(combinedAudio, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combinedAudio.length.toString(),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error: any) {
    console.error("Backend TTS API error:", error);
    return NextResponse.json(
      { error: "Internal server error during speech synthesis" },
      { status: 500 }
    );
  }
}
