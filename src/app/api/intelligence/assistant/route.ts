import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processFarmingQuery, ChatMessage } from "@/lib/ai/farmingAssistant";

export const dynamic = "force-dynamic";

interface RequestBody {
  message: string;
  locale?: string;
  inputLocale?: string;
  history?: ChatMessage[];
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const userMessage = (body.message || "").trim();
    const rawLocale = (body.locale || "en").toLowerCase();
    const locale = ["ta", "te", "kn", "ml", "hi"].includes(rawLocale) ? rawLocale : "en";

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
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

    // 2. Process query through multi-turn AI reasoning engine
    const result = await processFarmingQuery(userMessage, locale, body.history || [], {
      cropIntel,
      produceListings,
      inputProducts,
      machineryUnits,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Assistant API error:", error);
    return NextResponse.json(
      { error: "Failed to generate agricultural advice. Please try again." },
      { status: 500 }
    );
  }
}
