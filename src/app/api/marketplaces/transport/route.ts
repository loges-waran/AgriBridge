import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TransportListingSchema } from "@/lib/validation";

export async function GET() {
  try {
    const [vehicles, requests] = await Promise.all([
      prisma.transportVehicle.findMany({
        where: { isAvailable: true },
        include: { transporter: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.transportRequest.findMany({
        where: { status: "OPEN" },
        include: { requester: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return NextResponse.json({ vehicles, requests });
  } catch (error) {
    console.error("GET transport error:", error);
    return NextResponse.json({ error: "Failed to fetch transport" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // 1. If it's a transport request
    if (body.type === "REQUEST") {
      const { pickupLocation, pickupDistrict, dropLocation, dropDistrict, cargoType, weightTons, preferredDate, offeredFare } = body;
      const request = await prisma.transportRequest.create({
        data: {
          requesterId: user.id,
          pickupLocation,
          pickupDistrict: pickupDistrict || user.district || "Thanjavur",
          dropLocation,
          dropDistrict: dropDistrict || "Madurai",
          cargoType,
          weightTons: Number(weightTons),
          preferredDate: new Date(preferredDate),
          offeredFare: offeredFare ? Number(offeredFare) : null,
          status: "OPEN",
        },
      });
      return NextResponse.json({ success: true, request }, { status: 201 });
    }

    // 2. Otherwise, adding a new vehicle to fleet
    const result = TransportListingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
    }

    const d = result.data;
    const vehicle = await prisma.transportVehicle.create({
      data: {
        transporterId: user.id,
        vehicleNumber: d.vehicleNumber,
        vehicleType: d.vehicleType,
        capacityTons: d.capacityTons,
        isRefrigerated: d.isRefrigerated,
        baseDistrict: d.baseDistrict,
        ratePerKm: d.ratePerKm,
        isAvailable: true,
      },
    });

    return NextResponse.json({ success: true, vehicle }, { status: 201 });
  } catch (error) {
    console.error("POST transport error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
