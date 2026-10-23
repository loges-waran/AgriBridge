import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
      return NextResponse.json({ error: "Forbidden: Administrator privileges required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const roleFilter = searchParams.get("role") || "";

    const users = await prisma.user.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { fullName: { contains: search } },
                  { email: { contains: search } },
                  { district: { contains: search } },
                ],
              }
            : {},
          roleFilter
            ? {
                roles: {
                  some: { role: roleFilter },
                },
              }
            : {},
        ],
      },
      include: {
        roles: true,
        verificationRecords: { take: 1, orderBy: { submittedAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin GET users error:", error);
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
    const { action, targetUserId, reason } = body;

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { roles: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    // Safety: Cannot suspend a SUPER_ADMIN
    if (targetUser.roles.some((r) => r.role === "SUPER_ADMIN")) {
      return NextResponse.json({ error: "Cannot modify or suspend Super Admin account" }, { status: 403 });
    }

    if (action === "SUSPEND") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: targetUserId },
          data: { isActive: false },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: "SUSPENDED_USER",
            targetType: "USER",
            targetId: targetUserId,
            details: `Account suspended. Reason: ${reason || "Policy violation"}`,
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: `Account ${targetUser.email} has been suspended.` });
    }

    if (action === "RESTORE") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: targetUserId },
          data: { isActive: true },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: "RESTORED_USER",
            targetType: "USER",
            targetId: targetUserId,
            details: `Account restored. Reason: ${reason || "Reinstated by administrator"}`,
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: `Account ${targetUser.email} has been restored.` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin POST users action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
