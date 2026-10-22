import React from "react";
import { prisma } from "@/lib/prisma";
import { HomePageClient } from "@/components/home/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Real database metrics (no fabricated numbers)
  const [
    totalProjects,
    totalGaps,
    totalWorkers,
    totalMachinery,
    totalProducts,
    totalProduce,
  ] = await Promise.all([
    prisma.farmProject.count(),
    prisma.resourceGap.count({ where: { status: "OPEN" } }),
    prisma.labourProfile.count(),
    prisma.machinery.count(),
    prisma.inputProduct.count(),
    prisma.produceListing.count(),
  ]);

  const activeProjects = await prisma.farmProject.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      farmer: { select: { fullName: true, district: true } },
      farm: { select: { district: true } },
      resourceGaps: { select: { id: true } },
    },
  });

  return (
    <HomePageClient
      totalProjects={totalProjects}
      totalGaps={totalGaps}
      totalWorkers={totalWorkers}
      totalMachinery={totalMachinery}
      totalProducts={totalProducts}
      totalProduce={totalProduce}
      activeProjects={activeProjects}
    />
  );
}
