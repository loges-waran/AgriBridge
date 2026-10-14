import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ResourceGapSchema } from "@/lib/validation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: projectId } = await params;
    const body = await req.json();
    const result = ResourceGapSchema.safeParse({ ...body, projectId });
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
    }

    const { category, title, quantityNeeded, unit, urgency, notes } = result.data;

    const gap = await prisma.resourceGap.create({
      data: {
        projectId,
        category,
        title,
        quantityNeeded: quantityNeeded || null,
        unit: unit || null,
        urgency,
        notes: notes || null,
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, gap }, { status: 201 });
  } catch (error) {
    console.error("POST gap error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
