import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { InputProductSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = { stockQuantity: { gt: 0 } };
    if (category) where.category = category;

    const products = await prisma.inputProduct.findMany({
      where,
      include: { supplier: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("GET inputs error:", error);
    return NextResponse.json({ error: "Failed to fetch inputs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // 1. If it's placing an input purchase order
    if (body.type === "ORDER") {
      const { productId, quantity, deliveryAddress, projectId } = body;
      const product = await prisma.inputProduct.findUnique({ where: { id: productId } });
      if (!product || product.stockQuantity < quantity) {
        return NextResponse.json({ error: "Product unavailable or insufficient stock" }, { status: 400 });
      }

      const totalAmount = product.unitPrice * quantity;

      // ACID Transaction: Create order, create item, decrement inventory stock
      const order = await prisma.$transaction(async (tx) => {
        const ord = await tx.inputOrder.create({
          data: {
            farmerId: user.id,
            projectId: projectId || null,
            totalAmount,
            deliveryAddress: deliveryAddress || "Farm Gate, Thanjavur",
            status: "PENDING",
            items: {
              create: {
                productId,
                quantity: Number(quantity),
                pricePerUnit: product.unitPrice,
                totalPrice: totalAmount,
              },
            },
          },
          include: { items: true },
        });

        await tx.inputProduct.update({
          where: { id: productId },
          data: { stockQuantity: { decrement: Number(quantity) } },
        });

        // Record expense if linked to project
        if (projectId) {
          await tx.expenseRecord.create({
            data: {
              projectId,
              payerId: user.id,
              category: product.category,
              description: `Purchased ${quantity}x ${product.name}`,
              amount: totalAmount,
            },
          });
        }

        return ord;
      });

      return NextResponse.json({ success: true, order }, { status: 201 });
    }

    // 2. Otherwise, adding a new input product
    const result = InputProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
    }

    // Find supplier profile
    let supplierProfile = await prisma.supplierProfile.findUnique({
      where: { userId: user.id },
    });
    if (!supplierProfile) {
      supplierProfile = await prisma.supplierProfile.create({
        data: {
          userId: user.id,
          businessName: `${user.fullName}'s Agri Store`,
          district: user.district || "Tiruchirappalli",
        },
      });
    }

    const d = result.data;
    const product = await prisma.inputProduct.create({
      data: {
        supplierId: supplierProfile.id,
        name: d.name,
        category: d.category,
        brand: d.brand,
        packageSize: d.packageSize,
        unitPrice: d.unitPrice,
        stockQuantity: d.stockQuantity,
        isOrganic: d.isOrganic,
        description: d.description,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("POST inputs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
