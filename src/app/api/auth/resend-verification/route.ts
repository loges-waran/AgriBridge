import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ResendVerificationSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`resend-verification:${ip}`, { intervalMs: 60000, maxRequests: 5 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many resend attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = ResendVerificationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const normalizedEmail = result.data.email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Email is already verified. You can log in directly.",
      });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationCode: verificationCode,
        emailVerificationExpires: verificationExpires,
      },
    });

    console.log(`[AgriBridge Auth] Resent verification code for ${normalizedEmail}: ${verificationCode}`);

    return NextResponse.json({
      success: true,
      message: "A new 6-digit verification code has been generated.",
      previewCode: verificationCode,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
