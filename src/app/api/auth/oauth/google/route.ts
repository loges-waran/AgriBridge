import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE_NAME, hashPassword } from "@/lib/auth";
import crypto from "crypto";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  const isConfigured = Boolean(clientId && clientSecret);

  return NextResponse.json({
    configured: isConfigured,
    provider: "google",
    authUrl: isConfigured
      ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=code&scope=openid%20email%20profile&redirect_uri=${encodeURIComponent(
          (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000") + "/api/auth/oauth/google/callback"
        )}`
      : null,
    message: isConfigured
      ? "Google OAuth is ready."
      : "Google OAuth is not configured. Provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables to enable.",
  });
}

export async function POST(req: Request) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        {
          error: "OAuth not configured",
          message:
            "Google OAuth is not configured in this environment. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in production.",
        },
        { status: 501 }
      );
    }

    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }

    // Safely verify token with Google tokeninfo
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "Invalid Google ID token" }, { status: 401 });
    }

    const tokenInfo = await verifyRes.json();

    if (tokenInfo.aud !== clientId) {
      return NextResponse.json({ error: "Token audience mismatch" }, { status: 401 });
    }

    if (tokenInfo.email_verified !== "true" && tokenInfo.email_verified !== true) {
      return NextResponse.json(
        { error: "Google account email is not verified" },
        { status: 400 }
      );
    }

    const email = tokenInfo.email.toLowerCase().trim();
    const fullName = tokenInfo.name || "AgriBridge User";
    const googleSub = tokenInfo.sub;

    let user = await prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (user) {
      // Safely link identity to existing account
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: "google",
          oauthId: googleSub,
          isEmailVerified: true,
          emailVerifiedAt: user.emailVerifiedAt || new Date(),
        },
        include: { roles: true },
      });
    } else {
      // Create new verified account
      const randomSecret = crypto.randomBytes(32).toString("hex");
      const passwordHash = await hashPassword(randomSecret);

      user = await prisma.user.create({
        data: {
          email,
          fullName,
          passwordHash,
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          oauthProvider: "google",
          oauthId: googleSub,
          kycStatus: "NOT_SUBMITTED",
          roles: {
            create: [{ role: "FARMER", isDefault: true }],
          },
        },
        include: { roles: true },
      });
    }

    const roleNames = user.roles.map((r) => r.role);
    const defaultRole = user.roles.find((r) => r.isDefault)?.role || roleNames[0] || "FARMER";

    const sessionToken = await createSessionToken({
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
        isEmailVerified: true,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("OAuth verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
