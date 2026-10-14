import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const intelligence = await prisma.agriculturalIntelligence.findMany({
      orderBy: { cropName: "asc" },
    });
    return NextResponse.json({ intelligence });
  } catch (error) {
    console.error("GET intelligence error:", error);
    return NextResponse.json({ error: "Failed to fetch agricultural intelligence" }, { status: 500 });
  }
}
