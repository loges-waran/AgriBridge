import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { MachineryListingSchema, MachineryBookingSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const district = searchParams.get("district");

    const where: any = { isAvailable: true };
    if (category) where.category = category;
    if (district) where.district = district;

    const machines = await prisma.machinery.findMany({
      where,
      include: { owner: true, bookings: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ machines });
  } catch (error) {
    console.error("GET machinery error:", error);
    return NextResponse.json({ error: "Failed to fetch machinery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // 1. If it's a rental booking request
    if (body.type === "BOOKING") {
      const result = MachineryBookingSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
      }

      const { machineryId, startDate, endDate, totalUnitsBooked, pickupAddress, projectId } = result.data;
      const machine = await prisma.machinery.findUnique({ where: { id: machineryId } });
      if (!machine) return NextResponse.json({ error: "Machinery not found" }, { status: 404 });

      const totalAmount = machine.rentalRate * totalUnitsBooked;

      const booking = await prisma.machineryBooking.create({
        data: {
          machineryId,
          renterId: user.id,
          projectId: projectId || null,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalUnitsBooked,
          totalAmount,
          pickupAddress: pickupAddress || null,
          status: "REQUESTED",
        },
      });

      return NextResponse.json({ success: true, booking }, { status: 201 });
    }

    // 2. Otherwise, adding a new equipment listing
    const result = MachineryListingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
    }

    const d = result.data;
    const machine = await prisma.machinery.create({
      data: {
        ownerId: user.id,
        name: d.name,
        category: d.category,
        modelYear: d.modelYear,
        specs: d.specs,
        rateType: d.rateType,
        rentalRate: d.rentalRate,
        district: d.district,
        serviceRadiusKm: d.serviceRadiusKm,
        providesOperator: d.providesOperator,
        fuelIncluded: d.fuelIncluded,
        isAvailable: true,
      },
    });

    return NextResponse.json({ success: true, machine }, { status: 201 });
  } catch (error) {
    console.error("POST machinery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
