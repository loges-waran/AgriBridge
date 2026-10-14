import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ProduceListingSchema, BuyerOfferSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const crop = searchParams.get("crop");
    const district = searchParams.get("district");

    const where: any = { status: "AVAILABLE" };
    if (crop) where.cropName = { contains: crop };
    if (district) where.locationDistrict = district;

    const listings = await prisma.produceListing.findMany({
      where,
      include: { farmer: true, offers: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("GET produce error:", error);
    return NextResponse.json({ error: "Failed to fetch produce" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // 1. If it's a Buyer submitting an offer
    if (body.type === "OFFER") {
      const result = BuyerOfferSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
      }

      const { listingId, offeredPricePerKg, quantityRequestedKg, paymentTerms, notes } = result.data;
      const offer = await prisma.buyerOffer.create({
        data: {
          listingId,
          buyerId: user.id,
          offeredPricePerKg,
          quantityRequestedKg,
          paymentTerms,
          notes: notes || null,
          status: "OFFERED",
        },
      });

      return NextResponse.json({ success: true, offer }, { status: 201 });
    }

    // 2. Otherwise, farmer creating a produce listing
    const result = ProduceListingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
    }

    const d = result.data;
    const listing = await prisma.produceListing.create({
      data: {
        farmerId: user.id,
        projectId: d.projectId || null,
        cropName: d.cropName,
        variety: d.variety || null,
        grade: d.grade,
        quantityKg: d.quantityKg,
        minimumOrderKg: d.minimumOrderKg,
        expectedHarvestDate: new Date(d.expectedHarvestDate),
        isPreHarvestListing: d.isPreHarvestListing,
        askingPricePerKg: d.askingPricePerKg,
        packagingType: d.packagingType,
        locationDistrict: d.locationDistrict,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    console.error("POST produce error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
