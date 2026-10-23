import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { ResetPasswordSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = rateLimit(`reset-password:${ip}`, { intervalMs: 60000, maxRequests: 5 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many password reset attempts. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = ResetPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { token, newPassword } = result.data;

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token.trim(),
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset link. Please request a new one." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You can now log in with your new credentials.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
