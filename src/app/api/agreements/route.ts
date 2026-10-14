import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const agreements = await prisma.agreement.findMany({
      where: {
        OR: [
          { partnerId: user.id },
          { project: { farmerId: user.id } },
        ],
      },
      include: { partner: true, project: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ agreements });
  } catch (error) {
    console.error("GET agreements error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { projectId, partnerId, type, title, termsSummary, clauses, effectiveDate } = body;

    const agreement = await prisma.agreement.create({
      data: {
        projectId: projectId || null,
        partnerId: partnerId || user.id,
        type,
        title,
        termsSummary,
        clauses: typeof clauses === "string" ? clauses : JSON.stringify(clauses || {}),
        effectiveDate: new Date(effectiveDate || Date.now()),
        status: "CONFIRMED",
      },
    });

    return NextResponse.json({ success: true, agreement }, { status: 201 });
  } catch (error) {
    console.error("POST agreement error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
