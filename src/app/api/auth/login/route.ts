import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({
      where: { email },
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

    const roleNames = user.roles.map((r) => r.role);
    const defaultRole = user.roles.find((r) => r.isDefault)?.role || roleNames[0] || "FARMER";

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      activeRole: defaultRole,
      roles: roleNames,
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
