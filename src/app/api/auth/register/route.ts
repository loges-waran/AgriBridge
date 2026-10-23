import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`register:${ip}`, { intervalMs: 60000, maxRequests: 10 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = RegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password, fullName, phone, district, state, roles } = result.data;

    // Defense-in-depth: Never allow ADMIN or SUPER_ADMIN assignment via public registration
    if (roles.includes("ADMIN") || roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Administrator privileges cannot be assigned through public registration" },
        { status: 403 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        fullName,
        phone,
        district,
        state,
        kycStatus: "NOT_SUBMITTED",
        isEmailVerified: false,
        emailVerificationCode: verificationCode,
        emailVerificationExpires: verificationExpires,
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

    console.log(`[AgriBridge Auth] Email verification code for ${normalizedEmail}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email: user.email,
      roles,
      message: "Registration successful. Please verify your email with the 6-digit verification code.",
      previewCode: verificationCode,
    }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
