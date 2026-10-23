import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const settings = await prisma.platformSetting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Admin GET settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || (!currentUser.roles.includes("ADMIN") && !currentUser.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Setting key is required" }, { status: 400 });
    }

    const updated = await prisma.$transaction([
      prisma.platformSetting.upsert({
        where: { key },
        update: { value: String(value), updatedBy: currentUser.id },
        create: { key, value: String(value), updatedBy: currentUser.id },
      }),
      prisma.adminAuditLog.create({
        data: {
          adminId: currentUser.id,
          action: "UPDATED_SETTINGS",
          targetType: "PLATFORM_SETTING",
          targetId: key,
          details: `Updated platform configuration key '${key}' to '${value}'.`,
        },
      }),
    ]);

    return NextResponse.json({ success: true, setting: updated[0] });
  } catch (error) {
    console.error("Admin POST settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
