import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const records = await prisma.landRecord.findMany({
      include: {
        farm: true,
        owner: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ records });
  } catch (error) {
    console.error("GET land error:", error);
    return NextResponse.json({ error: "Failed to fetch land records" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { titleNumber, acresAvailable, soilPh, leaseType, expectedRentPerAcre, leaseDurationMonths, notes } = body;

    // Create or find farm
    let farm = await prisma.farm.findFirst({ where: { ownerId: user.id } });
    if (!farm) {
      farm = await prisma.farm.create({
        data: {
          ownerId: user.id,
          name: `${user.fullName}'s Agricultural Land`,
          locationName: user.district || "Cauvery Delta",
          district: user.district || "Thanjavur",
          totalAcres: Number(acresAvailable),
          soilType: "Alluvial Red Loam",
          waterSource: "Borewell + Canal",
        },
      });
    }

    const landRecord = await prisma.landRecord.create({
      data: {
        ownerId: user.id,
        farmId: farm.id,
        titleNumber,
        acresAvailable: Number(acresAvailable),
        soilPh: soilPh ? Number(soilPh) : 6.8,
        leaseType: leaseType || "LEASE",
        expectedRentPerAcre: expectedRentPerAcre ? Number(expectedRentPerAcre) : null,
        leaseDurationMonths: leaseDurationMonths ? Number(leaseDurationMonths) : 12,
        isVerified: true,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, landRecord }, { status: 201 });
  } catch (error) {
    console.error("POST land error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
