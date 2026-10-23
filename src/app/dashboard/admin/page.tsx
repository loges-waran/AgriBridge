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

  let totalUsers = 0;
  let totalProjects = 0;
  let totalListings = 0;
  let totalTxns = 0;
  let users: any[] = [];
  let landRecords: any[] = [];
  let suppliers: any[] = [];
  let produceListings: any[] = [];
  let complaints: any[] = [];
  let financialTxns: any[] = [];
  let agreements: any[] = [];
  let aiLogs: any[] = [];
  let settings: any[] = [];
  let auditLogs: any[] = [];

  try {
    const res = await Promise.all([
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

    totalUsers = res[0];
    totalProjects = res[1];
    totalListings = res[2];
    totalTxns = res[3];
    users = res[4];
    landRecords = res[5];
    suppliers = res[6];
    produceListings = res[7];
    complaints = res[8];
    financialTxns = res[9];
    agreements = res[10];
    aiLogs = res[11];
    settings = res[12];
    auditLogs = res[13];
  } catch (error) {
    console.error("Admin dashboard queries error:", error);
  }

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
