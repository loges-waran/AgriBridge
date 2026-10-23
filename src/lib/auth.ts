import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "agribridge_super_secure_jwt_token_secret_development_min_32_characters";
const key = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE_NAME = "agribridge_session";

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  activeRole: string;
  roles: string[];
  isEmailVerified?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  district: string | null;
  state: string | null;
  kycStatus: string;
  isEmailVerified: boolean;
  activeRole: string;
  roles: string[];
  preferredLocale: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { roles: true },
    });

    if (!user || !user.isActive) return null;

    const roleNames = user.roles.map((r) => r.role);
    const activeRole = roleNames.includes(payload.activeRole)
      ? payload.activeRole
      : roleNames[0] || "FARMER";

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      district: user.district,
      state: user.state,
      kycStatus: user.kycStatus,
      isEmailVerified: Boolean(user.isEmailVerified),
      activeRole,
      roles: roleNames,
      preferredLocale: user.preferredLocale,
    };
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}
