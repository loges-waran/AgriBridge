import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const [unverifiedLand, unverifiedSuppliers, produceListings, inputProducts] = await Promise.all([
      prisma.landRecord.findMany({
        include: { owner: true, farm: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.supplierProfile.findMany({
        include: { user: true, products: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.produceListing.findMany({
        include: { farmer: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.inputProduct.findMany({
        include: { supplier: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    return NextResponse.json({
      landRecords: unverifiedLand,
      suppliers: unverifiedSuppliers,
      produceListings,
      inputProducts,
    });
  } catch (error) {
    console.error("Admin GET listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (!currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const { action, targetId, verify, statusNote } = body;

    if (action === "VERIFY_LAND") {
      const isVerified = Boolean(verify);
      await prisma.$transaction([
        prisma.landRecord.update({
          where: { id: targetId },
          data: { isVerified },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: isVerified ? "VERIFIED_LAND_RECORD" : "REJECTED_LAND_RECORD",
            targetType: "LAND_RECORD",
            targetId,
            details: `Land Patta verification updated to ${isVerified ? "VERIFIED" : "UNVERIFIED"}. Note: ${statusNote || "Routine inspection"}`,
          },
        }),
      ]);
      return NextResponse.json({ success: true, isVerified });
    }

    if (action === "VERIFY_SUPPLIER") {
      const isVerified = Boolean(verify);
      await prisma.$transaction([
        prisma.supplierProfile.update({
          where: { id: targetId },
          data: { isVerified },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: isVerified ? "VERIFIED_SUPPLIER" : "REJECTED_SUPPLIER",
            targetType: "SUPPLIER_PROFILE",
            targetId,
            details: `Supplier license status set to ${isVerified ? "VERIFIED" : "UNVERIFIED"}. Note: ${statusNote || "License validation"}`,
          },
        }),
      ]);
      return NextResponse.json({ success: true, isVerified });
    }

    if (action === "MODERATE_PRODUCE") {
      const newStatus = body.status || "AVAILABLE"; // AVAILABLE | BANNED
      await prisma.$transaction([
        prisma.produceListing.update({
          where: { id: targetId },
          data: { status: newStatus },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: newStatus === "BANNED" ? "BANNED_LISTING" : "APPROVED_LISTING",
            targetType: "PRODUCE_LISTING",
            targetId,
            details: `Produce listing status updated to ${newStatus}. Note: ${statusNote || "Moderation policy"}`,
          },
        }),
      ]);
      return NextResponse.json({ success: true, status: newStatus });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin POST listings action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
