import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FarmProjectSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get("crop");
    const season = searchParams.get("season");

    const where: any = {};
    if (crop) where.cropName = { contains: crop };
    if (season) where.season = season;

    const projects = await prisma.farmProject.findMany({
      where,
      include: {
        farmer: true,
        farm: true,
        resourceGaps: true,
        milestones: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = FarmProjectSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if farmer has a registered farm, or create a default farm
    let farmId = data.farmId;
    if (!farmId) {
      let existingFarm = await prisma.farm.findFirst({
        where: { ownerId: user.id },
      });
      if (!existingFarm) {
        existingFarm = await prisma.farm.create({
          data: {
            ownerId: user.id,
            name: `${user.fullName}'s Farm Parcel`,
            locationName: user.district || "Cauvery Delta",
            district: user.district || "Thanjavur",
            totalAcres: data.acresAllotted,
            soilType: "Clay Loam",
            waterSource: "Perennial Borewell",
          },
        });
      }
      farmId = existingFarm.id;
    }

    const project = await prisma.farmProject.create({
      data: {
        farmerId: user.id,
        farmId,
        title: data.title,
        description: data.description,
        cropName: data.cropName,
        variety: data.variety,
        season: data.season,
        acresAllotted: data.acresAllotted,
        expectedSowingDate: new Date(data.expectedSowingDate),
        expectedHarvestDate: new Date(data.expectedHarvestDate),
        targetYieldKg: data.targetYieldKg,
        projectedRevenue: data.projectedRevenue,
        estimatedBudget: data.estimatedBudget,
        status: "PLANNING",
      },
    });

    // Populate initial default agricultural milestones
    await prisma.projectMilestone.createMany({
      data: [
        {
          projectId: project.id,
          title: "Land Preparation & Basal Manuring",
          targetDate: new Date(data.expectedSowingDate),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Sowing / Line Transplanting",
          targetDate: new Date(new Date(data.expectedSowingDate).getTime() + 10 * 86400000),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Weeding & Pest Bio-Shield",
          targetDate: new Date(new Date(data.expectedSowingDate).getTime() + 35 * 86400000),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Harvesting & Mandi Weighment",
          targetDate: new Date(data.expectedHarvestDate),
          status: "PENDING",
        },
      ],
    });

    // If gaps are passed in the request body
    if (Array.isArray(body.resourceGaps) && body.resourceGaps.length > 0) {
      await prisma.resourceGap.createMany({
        data: body.resourceGaps.map((g: any) => ({
          projectId: project.id,
          category: g.category,
          title: g.title,
          quantityNeeded: g.quantityNeeded ? Number(g.quantityNeeded) : null,
          unit: g.unit || null,
          urgency: g.urgency || "MEDIUM",
          notes: g.notes || null,
          status: "OPEN",
        })),
      });
    }

    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    console.error("POST project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
