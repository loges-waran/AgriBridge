import { prisma } from "./prisma";

export interface MatchResult<T> {
  candidate: T;
  score: number; // 0 to 100
  matchReasons: string[];
  caveats: string[];
  isEligible: boolean;
}

export async function findMatchesForProject(projectId: string) {
  const project = await prisma.farmProject.findUnique({
    where: { id: projectId },
    include: {
      farm: true,
      resourceGaps: true,
      farmer: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const projectDistrict = project.farm?.district || project.farmer.district || "Thanjavur";

  // 1. LABOUR MATCHES
  const labourGaps = project.resourceGaps.filter((g) => g.category === "LABOUR" && g.status === "OPEN");
  const workers = await prisma.labourProfile.findMany({
    where: { isAvailable: true },
    include: { user: true },
  });

  const labourMatches: MatchResult<any>[] = workers.map((w) => {
    let score = 50;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    // District proximity
    if (w.user.district?.toLowerCase() === projectDistrict.toLowerCase()) {
      score += 25;
      matchReasons.push(`Located in same district (${projectDistrict})`);
    } else {
      caveats.push(`Located in ${w.user.district || 'neighboring district'}`);
    }

    // Skills check
    if (w.skills.toLowerCase().includes(project.cropName.toLowerCase()) || w.skills.toLowerCase().includes("transplanting") || w.skills.toLowerCase().includes("harvest")) {
      score += 15;
      matchReasons.push(`Possesses required agronomic skills (${w.skills.split(",")[0]})`);
    }

    // Crew capacity
    const targetWorkers = labourGaps[0]?.quantityNeeded || 4;
    if (w.crewSize >= targetWorkers) {
      score += 10;
      matchReasons.push(`Can supply required gang size (${w.crewSize} workers available)`);
    } else {
      caveats.push(`Team size is ${w.crewSize} (need ${targetWorkers})`);
    }

    return {
      candidate: w,
      score: Math.min(100, score),
      matchReasons,
      caveats,
      isEligible: score >= 40,
    };
  });

  // 2. MACHINERY MATCHES
  const machines = await prisma.machinery.findMany({
    where: { isAvailable: true },
    include: { owner: true },
  });

  const machineryMatches: MatchResult<any>[] = machines.map((m) => {
    let score = 50;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    if (m.district.toLowerCase() === projectDistrict.toLowerCase()) {
      score += 30;
      matchReasons.push(`Direct regional coverage in ${projectDistrict}`);
    } else {
      caveats.push(`Based in ${m.district}`);
    }

    if (m.providesOperator) {
      score += 10;
      matchReasons.push("Includes trained machine operator");
    }

    if (m.category === "TRACTOR" || m.category === "HARVESTER" || m.category === "DRONE") {
      score += 10;
      matchReasons.push(`High utility for ${project.cropName} crop cycle`);
    }

    return {
      candidate: m,
      score: Math.min(100, score),
      matchReasons,
      caveats,
      isEligible: score >= 40,
    };
  });

  // 3. INPUT PRODUCT MATCHES
  const products = await prisma.inputProduct.findMany({
    where: { stockQuantity: { gt: 0 } },
    include: { supplier: true },
  });

  const inputMatches: MatchResult<any>[] = products.map((p) => {
    let score = 50;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    if (p.isOrganic) {
      score += 25;
      matchReasons.push("Certified organic / bio-compatible input");
    }

    if (p.name.toLowerCase().includes(project.cropName.toLowerCase()) || p.category === "SEED" || p.category === "FERTILIZER") {
      score += 25;
      matchReasons.push(`Directly suited for ${project.cropName} cultivation`);
    }

    return {
      candidate: p,
      score: Math.min(100, score),
      matchReasons,
      caveats,
      isEligible: score >= 50,
    };
  });

  // 4. BUYER MATCHES
  const buyers = await prisma.buyerProfile.findMany({
    include: { user: true },
  });

  const buyerMatches: MatchResult<any>[] = buyers.map((b) => {
    let score = 50;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    if (b.isVerified) {
      score += 20;
      matchReasons.push("Verified trade license & GST compliance");
    }

    if (b.preferredCrops?.toLowerCase().includes(project.cropName.toLowerCase())) {
      score += 30;
      matchReasons.push(`Actively purchasing ${project.cropName}`);
    } else {
      caveats.push(`General buyer in ${b.district}`);
    }

    return {
      candidate: b,
      score: Math.min(100, score),
      matchReasons,
      caveats,
      isEligible: score >= 40,
    };
  });

  // 5. TRANSPORTER MATCHES
  const vehicles = await prisma.transportVehicle.findMany({
    where: { isAvailable: true },
    include: { transporter: true },
  });

  const transportMatches: MatchResult<any>[] = vehicles.map((v) => {
    let score = 50;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    if (v.baseDistrict.toLowerCase() === projectDistrict.toLowerCase()) {
      score += 30;
      matchReasons.push(`Vehicle stationed in ${projectDistrict}`);
    }

    if (v.capacityTons >= 3.0) {
      score += 20;
      matchReasons.push(`Capacity (${v.capacityTons}T) handles bulk harvest dispatch`);
    }

    return {
      candidate: v,
      score: Math.min(100, score),
      matchReasons,
      caveats,
      isEligible: score >= 40,
    };
  });

  // 6. INVESTOR MATCHES
  const investors = await prisma.user.findMany({
    where: {
      roles: { some: { role: "INVESTOR" } },
      isActive: true,
    },
    include: { investorProposals: true },
  });

  const investorMatches: MatchResult<any>[] = investors.map((inv) => {
    let score = 60;
    const matchReasons: string[] = [];
    const caveats: string[] = [];

    if (inv.kycStatus === "VERIFIED") {
      score += 20;
      matchReasons.push("KYC-verified agri-investor");
    }

    matchReasons.push("Focus on sustainable farming and delta crop cycles");

    return {
      candidate: inv,
      score: Math.min(100, score),
      matchReasons,
      caveats,
      isEligible: true,
    };
  });

  return {
    project,
    labourMatches: labourMatches.sort((a, b) => b.score - a.score),
    machineryMatches: machineryMatches.sort((a, b) => b.score - a.score),
    inputMatches: inputMatches.sort((a, b) => b.score - a.score),
    buyerMatches: buyerMatches.sort((a, b) => b.score - a.score),
    transportMatches: transportMatches.sort((a, b) => b.score - a.score),
    investorMatches: investorMatches.sort((a, b) => b.score - a.score),
  };
}
