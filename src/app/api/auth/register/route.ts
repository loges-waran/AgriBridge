import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password, fullName, phone, district, state, roles } = result.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        district,
        state,
        kycStatus: "NOT_SUBMITTED",
        roles: {
          create: roles.map((r, idx) => ({
            role: r,
            isDefault: idx === 0,
          })),
        },
      },
      include: {
        roles: true,
      },
    });

    // Auto-create relevant subprofile if worker, supplier, or buyer
    if (roles.includes("WORKER")) {
      await prisma.labourProfile.create({
        data: {
          userId: user.id,
          skills: "General Farm Work",
          dailyWageRate: 600,
          serviceRadiusKm: 20,
          crewSize: 1,
          isAvailable: true,
        },
      });
    }

    if (roles.includes("SUPPLIER")) {
      await prisma.supplierProfile.create({
        data: {
          userId: user.id,
          businessName: `${fullName}'s Agri Store`,
          district: district,
        },
      });
    }

    if (roles.includes("BUYER")) {
      await prisma.buyerProfile.create({
        data: {
          userId: user.id,
          businessName: `${fullName} Trading Co.`,
          buyerType: "MANDI_TRADER",
          district: district,
        },
      });
    }

    const defaultRole = roles[0];
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      activeRole: defaultRole,
      roles,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        activeRole: defaultRole,
        roles,
        kycStatus: user.kycStatus,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
