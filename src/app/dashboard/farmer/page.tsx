import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FarmerDashboardClient } from "./FarmerDashboardClient";

export const dynamic = "force-dynamic";

export default async function FarmerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!user.roles.includes("FARMER")) {
    redirect("/dashboard");
  }

  // Load farmer's farms, projects, resource gaps, listings, bookings, and proposals
  const [
    farms,
    projects,
    produceListings,
    inputOrders,
    labourJobs,
    machineryBookings,
    investmentProposals,
  ] = await Promise.all([
    prisma.farm.findMany({
      where: { ownerId: user.id },
      include: { landRecords: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.farmProject.findMany({
      where: { farmerId: user.id },
      include: {
        resourceGaps: true,
        milestones: true,
        expenses: true,
        investmentProposals: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.produceListing.findMany({
      where: { farmerId: user.id },
      include: { offers: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.inputOrder.findMany({
      where: { farmerId: user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.labourJob.findMany({
      where: { farmerId: user.id },
      include: { applications: { include: { worker: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.machineryBooking.findMany({
      where: { renterId: user.id },
      include: { machinery: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.investmentProposal.findMany({
      where: { farmerId: user.id },
      include: { eoiList: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const sanitizedUser = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    district: user.district,
    state: user.state,
    kycStatus: user.kycStatus,
    activeRole: user.activeRole,
    roles: user.roles,
  };

  const sanitizedData = {
    farms: JSON.parse(JSON.stringify(farms)),
    projects: JSON.parse(JSON.stringify(projects)),
    produceListings: JSON.parse(JSON.stringify(produceListings)),
    inputOrders: JSON.parse(JSON.stringify(inputOrders)),
    labourJobs: JSON.parse(JSON.stringify(labourJobs)),
    machineryBookings: JSON.parse(JSON.stringify(machineryBookings)),
    investmentProposals: JSON.parse(JSON.stringify(investmentProposals)),
  };

  return <FarmerDashboardClient user={sanitizedUser} data={sanitizedData} />;
}
