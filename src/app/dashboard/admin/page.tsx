import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminConsoleClient from "./AdminConsoleClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) {
    redirect("/login");
  }

  const [
    totalUsers,
    totalProjects,
    totalListings,
    totalTxns,
    users,
    landRecords,
    suppliers,
    produceListings,
    complaints,
    financialTxns,
    agreements,
    aiLogs,
    settings,
    auditLogs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.farmProject.count(),
    prisma.produceListing.count(),
    prisma.financialTransaction.count(),
    prisma.user.findMany({
      include: { roles: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.landRecord.findMany({
      include: { owner: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.supplierProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.produceListing.findMany({
      include: { farmer: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.complaint.findMany({
      where: { status: "OPEN" },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.financialTransaction.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.agreement.findMany({
      include: { partner: true, project: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.aiUsageLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.platformSetting.findMany({
      orderBy: { key: "asc" },
    }),
    prisma.adminAuditLog.findMany({
      include: { admin: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const currentUserData = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    activeRole: user.activeRole,
    roles: user.roles,
    isSuperAdmin: user.roles.includes("SUPER_ADMIN"),
  };

  const initialData = {
    totalUsers,
    totalProjects,
    totalListings,
    totalTxns,
    users: JSON.parse(JSON.stringify(users)),
    landRecords: JSON.parse(JSON.stringify(landRecords)),
    suppliers: JSON.parse(JSON.stringify(suppliers)),
    produceListings: JSON.parse(JSON.stringify(produceListings)),
    complaints: JSON.parse(JSON.stringify(complaints)),
    financialTxns: JSON.parse(JSON.stringify(financialTxns)),
    agreements: JSON.parse(JSON.stringify(agreements)),
    aiLogs: JSON.parse(JSON.stringify(aiLogs)),
    settings: JSON.parse(JSON.stringify(settings)),
    auditLogs: JSON.parse(JSON.stringify(auditLogs)),
  };

  return <AdminConsoleClient currentUser={currentUserData} initialData={initialData} />;
}
