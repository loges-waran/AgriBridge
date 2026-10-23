import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`login:${ip}`, { intervalMs: 60000, maxRequests: 10 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { roles: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          error: "Your email address is not yet verified. Please verify your email to access your account.",
          requiresVerification: true,
          email: user.email,
        },
        { status: 403 }
      );
    }

    const roleNames = user.roles.map((r) => r.role);
    const defaultRole = user.roles.find((r) => r.isDefault)?.role || roleNames[0] || "FARMER";

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      activeRole: defaultRole,
      roles: roleNames,
      isEmailVerified: true,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        activeRole: defaultRole,
        roles: roleNames,
        kycStatus: user.kycStatus,
        isEmailVerified: true,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
