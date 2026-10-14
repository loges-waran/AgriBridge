import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.activeRole !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const complaints = await prisma.complaint.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error("GET disputes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // 1. If admin is resolving
    if (body.type === "RESOLVE") {
      if (user.activeRole !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

      const { complaintId, resolution } = body;
      const updated = await prisma.complaint.update({
        where: { id: complaintId },
        data: {
          status: "RESOLVED",
          resolution,
          resolvedAt: new Date(),
        },
      });

      await prisma.adminAuditLog.create({
        data: {
          adminId: user.id,
          action: "RESOLVED_DISPUTE",
          targetType: "COMPLAINT",
          targetId: complaintId,
          details: resolution,
        },
      });

      return NextResponse.json({ success: true, complaint: updated });
    }

    // 2. Otherwise user filing a complaint
    const { category, subject, description } = body;
    const complaint = await prisma.complaint.create({
      data: {
        userId: user.id,
        category,
        subject,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, complaint }, { status: 201 });
  } catch (error) {
    console.error("POST complaint error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
