import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [transactions, expenses] = await Promise.all([
      prisma.financialTransaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.expenseRecord.findMany({
        where: { payerId: user.id },
        include: { project: true },
        orderBy: { paidAt: "desc" },
      }),
    ]);

    return NextResponse.json({ transactions, expenses });
  } catch (error) {
    console.error("GET financials error:", error);
    return NextResponse.json({ error: "Failed to fetch financials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { referenceType, referenceId, amount, transactionType, description } = body;

    const txn = await prisma.financialTransaction.create({
      data: {
        userId: user.id,
        referenceType,
        referenceId,
        amount: Number(amount),
        transactionType,
        status: "COMPLETED",
        paymentMode: "ESCROW_SIMULATED",
        description,
      },
    });

    return NextResponse.json({ success: true, txn }, { status: 201 });
  } catch (error) {
    console.error("POST financial error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
