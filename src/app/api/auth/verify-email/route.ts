import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { VerifyEmailSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`verify-email:${ip}`, { intervalMs: 60000, maxRequests: 10 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = VerifyEmailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email, code } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      // User is already verified, create session token
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
        alreadyVerified: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          activeRole: defaultRole,
          roles: roleNames,
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
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (!user.emailVerificationCode || user.emailVerificationCode !== code.trim()) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check your code and try again." },
        { status: 400 }
      );
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Mark user as email verified
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationCode: null,
        emailVerificationExpires: null,
      },
      include: { roles: true },
    });

    const roleNames = updatedUser.roles.map((r) => r.role);
    const defaultRole = updatedUser.roles.find((r) => r.isDefault)?.role || roleNames[0] || "FARMER";

    const token = await createSessionToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      activeRole: defaultRole,
      roles: roleNames,
      isEmailVerified: true,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        activeRole: defaultRole,
        roles: roleNames,
        isEmailVerified: true,
      },
      message: "Email successfully verified! Welcome to AgriBridge.",
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
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
