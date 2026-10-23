import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { ForgotPasswordSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`forgot-password:${ip}`, { intervalMs: 60000, maxRequests: 5 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many password reset requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = ForgotPasswordSchema.safeParse(body);
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

    if (!user || !user.isActive) {
      // Return success to avoid email enumeration attacks
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset instruction has been generated.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    console.log(`[AgriBridge Auth] Password reset token for ${normalizedEmail}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully.",
      previewToken: resetToken,
      resetUrl: `/reset-password?token=${resetToken}`,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
