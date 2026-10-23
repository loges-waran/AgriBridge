import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const projectCount = await prisma.farmProject.count();
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      counts: {
        users: userCount,
        projects: projectCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "error",
        message: error?.message || "Database connection error",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
