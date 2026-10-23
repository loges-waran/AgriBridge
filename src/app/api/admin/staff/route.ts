import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || !user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden: Super Admin privileges strictly required" },
        { status: 403 }
      );
    }

    const staffUsers = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: { in: ["ADMIN", "SUPER_ADMIN"] },
          },
        },
      },
      include: { roles: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ staff: staffUsers });
  } catch (error) {
    console.error("Admin GET staff error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json(
        { error: "Forbidden: Super Admin privileges strictly required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { targetEmail, action } = body; // action: 'GRANT' | 'REVOKE'

    if (!targetEmail) {
      return NextResponse.json({ error: "Target email is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: targetEmail.toLowerCase().trim() },
      include: { roles: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 });
    }

    if (action === "GRANT") {
      // Cannot grant to self if already super admin
      const alreadyAdmin = targetUser.roles.some((r) => r.role === "ADMIN");
      if (alreadyAdmin) {
        return NextResponse.json({ error: "User already has staff admin privileges" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.userRole.create({
          data: {
            userId: targetUser.id,
            role: "ADMIN",
            isDefault: false,
          },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: "GRANTED_ADMIN_ROLE",
            targetType: "USER",
            targetId: targetUser.id,
            details: `Elevated staff admin privileges granted to ${targetUser.email} by Super Admin.`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Admin privileges successfully granted to ${targetUser.email}.`,
      });
    }

    if (action === "REVOKE") {
      // Guard: Cannot revoke Super Admin's privileges
      if (targetUser.roles.some((r) => r.role === "SUPER_ADMIN")) {
        return NextResponse.json(
          { error: "Security restriction: Cannot revoke Super Admin owner permissions" },
          { status: 403 }
        );
      }

      const adminRole = targetUser.roles.find((r) => r.role === "ADMIN");
      if (!adminRole) {
        return NextResponse.json({ error: "User does not have admin privileges to revoke" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.userRole.delete({
          where: { id: adminRole.id },
        }),
        prisma.adminAuditLog.create({
          data: {
            adminId: currentUser.id,
            action: "REVOKED_ADMIN_ROLE",
            targetType: "USER",
            targetId: targetUser.id,
            details: `Staff admin privileges revoked from ${targetUser.email} by Super Admin.`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Admin privileges successfully revoked from ${targetUser.email}.`,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin POST staff error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
