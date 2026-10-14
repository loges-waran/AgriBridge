import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.farmProject.findUnique({
      where: { id },
      include: {
        farmer: true,
        farm: true,
        resourceGaps: true,
        milestones: true,
        budgetEntries: true,
        expenses: { include: { payer: true } },
        investmentProposals: true,
        produceListings: true,
        agreements: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("GET project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const project = await prisma.farmProject.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.farmerId !== user.id && user.activeRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.farmProject.update({
      where: { id },
      data: {
        status: body.status || project.status,
        description: body.description !== undefined ? body.description : project.description,
        projectedRevenue: body.projectedRevenue !== undefined ? Number(body.projectedRevenue) : project.projectedRevenue,
        estimatedBudget: body.estimatedBudget !== undefined ? Number(body.estimatedBudget) : project.estimatedBudget,
      },
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("PATCH project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
