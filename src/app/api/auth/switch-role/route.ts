import { NextResponse } from "next/server";
import { getCurrentUser, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { role } = body;

    if (!user.roles.includes(role)) {
      return NextResponse.json(
        { error: "User does not have permission for this role" },
        { status: 403 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      activeRole: role,
      roles: user.roles,
    });

    const response = NextResponse.json({
      success: true,
      activeRole: role,
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
    console.error("Switch role error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
