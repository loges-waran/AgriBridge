import React from "react";
import { prisma } from "@/lib/prisma";
import { HomePageClient } from "@/components/home/HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let totalProjects = 0;
  let totalGaps = 0;
  let totalWorkers = 0;
  let totalMachinery = 0;
  let totalProducts = 0;
  let totalProduce = 0;
  let activeProjects: any[] = [];

  try {
    const counts = await Promise.all([
      prisma.farmProject.count(),
      prisma.resourceGap.count({ where: { status: "OPEN" } }),
      prisma.labourProfile.count(),
      prisma.machinery.count(),
      prisma.inputProduct.count(),
      prisma.produceListing.count(),
    ]);

    totalProjects = counts[0];
    totalGaps = counts[1];
    totalWorkers = counts[2];
    totalMachinery = counts[3];
    totalProducts = counts[4];
    totalProduce = counts[5];

    activeProjects = await prisma.farmProject.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        farmer: { select: { fullName: true, district: true } },
        farm: { select: { district: true } },
        resourceGaps: { select: { id: true } },
      },
    });
  } catch (error) {
    console.error("HomePage database query fallback:", error);
  }

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
