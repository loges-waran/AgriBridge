import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "agribridge_super_secure_jwt_token_secret_development_min_32_characters";
const key = new TextEncoder().encode(JWT_SECRET);
const SESSION_COOKIE_NAME = "agribridge_session";

interface TokenPayload {
  userId: string;
  email: string;
  fullName: string;
  activeRole: string;
  roles: string[];
}

const DASHBOARD_ROLE_MAP: Record<string, string> = {
  "/dashboard/farmer": "FARMER",
  "/dashboard/landowner": "LANDOWNER",
  "/dashboard/investor": "INVESTOR",
  "/dashboard/worker": "WORKER",
  "/dashboard/buyer": "BUYER",
  "/dashboard/machinery": "MACHINERY_OWNER",
  "/dashboard/supplier": "SUPPLIER",
  "/dashboard/transporter": "TRANSPORTER",
  "/dashboard/admin": "ADMIN",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. API Route Protection for Admin APIs
  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
      const userPayload = payload as unknown as TokenPayload;
      const userRoles = Array.isArray(userPayload.roles) ? userPayload.roles : [];
      if (!userRoles.includes("ADMIN") && !userRoles.includes("SUPER_ADMIN")) {
        return NextResponse.json(
          { error: "Forbidden: Administrator privileges required" },
          { status: 403 }
        );
      }
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }
  }

  // 2. Protected Page Routes
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtectedActionRoute =
    pathname === "/projects/new" ||
    pathname.startsWith("/agreements") ||
    pathname.startsWith("/financials") ||
    pathname.startsWith("/notifications");

  if (isDashboardRoute || isAdminRoute || isProtectedActionRoute) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    let payload: TokenPayload;
    try {
      const verified = await jwtVerify(token, key, { algorithms: ["HS256"] });
      payload = verified.payload as unknown as TokenPayload;
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const roles = Array.isArray(payload.roles) ? payload.roles : [];

    // Admin-only areas
    if (pathname.startsWith("/dashboard/admin") || isAdminRoute) {
      if (!roles.includes("ADMIN") && !roles.includes("SUPER_ADMIN")) {
        // Forbidden to non-admins
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    // Role-specific dashboard pages
    for (const [routePrefix, requiredRole] of Object.entries(DASHBOARD_ROLE_MAP)) {
      if (pathname.startsWith(routePrefix)) {
        if (!roles.includes(requiredRole)) {
          // User is not permitted for this role dashboard
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
      }
    }

    // Root /dashboard route: If single-role user, route directly to their permitted dashboard
    if (pathname === "/dashboard" && roles.length === 1) {
      const singleRolePath = `/dashboard/${roles[0].toLowerCase()}`;
      return NextResponse.redirect(new URL(singleRolePath, request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/projects/new",
    "/agreements/:path*",
    "/financials/:path*",
    "/notifications/:path*",
    "/api/admin/:path*",
  ],
};
