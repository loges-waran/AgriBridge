import { PrismaClient } from "@prisma/client";

const VERIFIED_SUPABASE_URL =
  "postgresql://postgres.wroqlbowesxqscypjlrg:3AXsN5F2NTNcAgD7@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

function getResolvedDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL?.trim();
  if (envUrl) {
    if (envUrl.includes("pooler.supabase.com")) {
      if (envUrl.includes("postgres.wroqlbowesxqscypjlrg")) {
        return envUrl;
      }
      return VERIFIED_SUPABASE_URL;
    }
    if (envUrl.startsWith("postgres")) {
      return envUrl;
    }
  }
  return VERIFIED_SUPABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getResolvedDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

