import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processFarmingQuery, ChatMessage } from "@/lib/ai/farmingAssistant";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

interface RequestBody {
  message: string;
  locale?: string;
  inputLocale?: string;
  history?: ChatMessage[];
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`ai-assistant:${ip}`, { intervalMs: 60000, maxRequests: 30 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many AI assistant requests. Please wait a moment before sending more questions." },
        { status: 429 }
      );
    }

    const body: RequestBody = await req.json();
    const userMessage = (body.message || "").trim();
    const rawLocale = (body.locale || "en").toLowerCase();
    const locale = ["ta", "te", "kn", "ml", "hi"].includes(rawLocale) ? rawLocale : "en";

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (userMessage.length > 1000) {
      return NextResponse.json(
        { error: "Message length exceeds maximum allowable limit of 1000 characters." },
        { status: 400 }
      );
    }

    // 1. Fetch live agricultural database context from AgriBridge
    let cropIntel: any[] = [];
    let produceListings: any[] = [];
    let inputProducts: any[] = [];
    let machineryUnits: any[] = [];

    try {
      [cropIntel, produceListings, inputProducts, machineryUnits] = await Promise.all([
        prisma.agriculturalIntelligence.findMany({ take: 10 }),
        prisma.produceListing.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          include: { farmer: { select: { fullName: true, district: true } } },
        }),
        prisma.inputProduct.findMany({ take: 6, select: { name: true, category: true, unitPrice: true } }),
        prisma.machinery.findMany({ take: 6, select: { name: true, category: true, rentalRate: true, rateType: true } }),
      ]);
    } catch (dbErr) {
      console.warn("Notice: Prisma DB query in assistant route:", dbErr);
    }

    const result = await processFarmingQuery(userMessage, locale, body.history || [], {
      cropIntel,
      produceListings,
      inputProducts,
      machineryUnits,
    });

    // Record AI assistant query and consumption metrics for Super Admin governance
    try {
      const isRefused = result.topic === "Agriculture Scope Only" || result.answer.includes("exclusively");
      await prisma.aiUsageLog.create({
        data: {
          prompt: userMessage.slice(0, 500),
          topic: result.topic || "Agricultural Guidance",
          provider: result.provider || "knowledge-base",
          locale,
          isSafe: !isRefused,
          flagReason: isRefused ? "Out of agriculture scope" : null,
          tokensUsed: Math.ceil(userMessage.length / 4) + Math.ceil((result.answer?.length || 0) / 4),
        },
      });
    } catch (logErr) {
      console.warn("AI usage logging notice:", logErr);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json(
      { error: "Failed to generate agricultural advice. Please try again." },
      { status: 500 }
    );
  }
}
