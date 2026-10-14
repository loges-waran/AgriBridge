import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const proposals = await prisma.investmentProposal.findMany({
      where: { status: "ACTIVE" },
      include: {
        project: {
          include: { farmer: true, farm: true, milestones: true },
        },
        eoiList: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ proposals });
  } catch (error) {
    console.error("GET proposals error:", error);
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { proposalId, proposedAmount, message } = body;

    const eoi = await prisma.expressionOfInterest.create({
      data: {
        proposalId,
        investorId: user.id,
        proposedAmount: Number(proposedAmount),
        message: message || null,
        status: "EXPRESSION_OF_INTEREST",
      },
    });

    return NextResponse.json({ success: true, eoi }, { status: 201 });
  } catch (error) {
    console.error("POST EOI error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
