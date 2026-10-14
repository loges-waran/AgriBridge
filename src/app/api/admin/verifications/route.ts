import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.activeRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const records = await prisma.user.findMany({
      include: { verificationRecords: true, roles: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ records });
  } catch (error) {
    console.error("GET verifications error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.activeRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { targetUserId, action, reviewerNote } = body; // action: 'VERIFY' | 'REJECT'

    const newStatus = action === "VERIFY" ? "VERIFIED" : "REJECTED";

    // Update user KYC and create audit log in an ACID transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: { kycStatus: newStatus },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: action === "VERIFY" ? "VERIFIED_USER" : "REJECTED_KYC",
          targetType: "USER",
          targetId: targetUserId,
          details: reviewerNote || `Admin updated KYC status to ${newStatus}`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, status: newStatus });
  } catch (error) {
    console.error("POST verification review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
