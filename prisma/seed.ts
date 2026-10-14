import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AgriBridge persistent database with verified DEMO records...");

  const salt = await bcrypt.genSalt(10);
  const commonPassword = await bcrypt.hash("AgriBridge2026!", salt);

  // 1. Create 9 Persona Users
  const usersData = [
    {
      email: "farmer@agribridge.org",
      fullName: "Murugan Selvam [DEMO Farmer]",
      role: "FARMER",
      phone: "+91 98401 23456",
      district: "Thanjavur",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Progressive paddy and sugarcane cultivator with 14 years experience in the Cauvery Delta.",
    },
    {
      email: "landowner@agribridge.org",
      fullName: "Rangasamy Chettiar [DEMO Landowner]",
      role: "LANDOWNER",
      phone: "+91 98402 34567",
      district: "Thanjavur",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Owner of 25 acres fertile delta land seeking responsible organic farming lease partners.",
    },
    {
      email: "investor@agribridge.org",
      fullName: "Karthik Narayanan [DEMO Agri-Investor]",
      role: "INVESTOR",
      phone: "+91 98403 45678",
      district: "Chennai",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Impact angel investor backing sustainable agriculture, organic paddy, and cold-storage projects.",
    },
    {
      email: "worker@agribridge.org",
      fullName: "Palanisamy K. [DEMO Farm Worker]",
      role: "WORKER",
      phone: "+91 98404 56789",
      district: "Thiruvarur",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Skilled agricultural worker and team leader experienced in paddy transplantation and harvest.",
    },
    {
      email: "buyer@agribridge.org",
      fullName: "Sundaram Traders [DEMO Wholesale Buyer]",
      role: "BUYER",
      phone: "+91 98405 67890",
      district: "Madurai",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Wholesale grain aggregator supplying premium rice mills and regional organic food brands.",
    },
    {
      email: "machinery@agribridge.org",
      fullName: "Anbu Agro Rentals [DEMO Machinery Owner]",
      role: "MACHINERY_OWNER",
      phone: "+91 98406 78901",
      district: "Thanjavur",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Tractor and agricultural implement provider serving Thanjavur and Kumbakonam farming clusters.",
    },
    {
      email: "supplier@agribridge.org",
      fullName: "Cauvery Bio-Inputs [DEMO Supplier]",
      role: "SUPPLIER",
      phone: "+91 98407 89012",
      district: "Tiruchirappalli",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Certified organic fertilizer, bio-stimulants, and certified hybrid seed distribution hub.",
    },
    {
      email: "transporter@agribridge.org",
      fullName: "Delta Freight Logistics [DEMO Transporter]",
      role: "TRANSPORTER",
      phone: "+91 98408 90123",
      district: "Thanjavur",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "Fleet of 3-ton and 10-ton lorries optimized for agricultural grain and vegetable dispatch.",
    },
    {
      email: "admin@agribridge.org",
      fullName: "Platform Administrator [DEMO Admin]",
      role: "ADMIN",
      phone: "+91 98400 00001",
      district: "Chennai",
      state: "Tamil Nadu",
      kycStatus: "VERIFIED",
      bio: "AgriBridge Chief Governance Officer and KYC verification manager.",
    },
  ];

  const createdUsers: Record<string, any> = {};

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        fullName: u.fullName,
        phone: u.phone,
        district: u.district,
        state: u.state,
        kycStatus: u.kycStatus,
        bio: u.bio,
      },
      create: {
        email: u.email,
        passwordHash: commonPassword,
        fullName: u.fullName,
        phone: u.phone,
        district: u.district,
        state: u.state,
        kycStatus: u.kycStatus,
        bio: u.bio,
      },
    });

    // Ensure role entry
    await prisma.userRole.upsert({
      where: { userId_role: { userId: user.id, role: u.role } },
      update: { isDefault: true },
      create: { userId: user.id, role: u.role, isDefault: true },
    });

    createdUsers[u.role] = user;
  }

  const farmer = createdUsers["FARMER"];
  const landowner = createdUsers["LANDOWNER"];
  const investor = createdUsers["INVESTOR"];
  const worker = createdUsers["WORKER"];
  const buyer = createdUsers["BUYER"];
  const machineryOwner = createdUsers["MACHINERY_OWNER"];
  const supplier = createdUsers["SUPPLIER"];
  const transporter = createdUsers["TRANSPORTER"];

  // 2. Worker Profile
  await prisma.labourProfile.upsert({
    where: { userId: worker.id },
    update: {},
    create: {
      userId: worker.id,
      skills: "Paddy Sowing, Mechanical Transplanting, Weeding, Harvesting, Tractor Driving",
      yearsExperience: 8,
      dailyWageRate: 650.0,
      serviceRadiusKm: 25.0,
      crewSize: 6,
      isAvailable: true,
      availabilityNote: "Available for upcoming Kuruvai and Samba sowing season in Delta districts.",
    },
  });

  // 3. Supplier Profile & Products
  const supplierProfile = await prisma.supplierProfile.upsert({
    where: { userId: supplier.id },
    update: {},
    create: {
      userId: supplier.id,
      businessName: "Cauvery Bio-Inputs & Agro Tech [DEMO]",
      licenseNumber: "TN-AGR-SUP-84729",
      district: "Tiruchirappalli",
      deliveryRadiusKm: 75.0,
      isVerified: true,
    },
  });

  const products = [
    {
      name: "Certified BPT 5204 (Samba Mahsuri) Paddy Seeds [DEMO]",
      category: "SEED",
      brand: "TNAU Certified",
      packageSize: "30 kg bag",
      unitPrice: 1850.0,
      stockQuantity: 120,
      isOrganic: true,
      description: "High yielding, pest-resistant fine grain paddy seed with 95% germination rate.",
    },
    {
      name: "Enriched Bio-Organic NPK Compost [DEMO]",
      category: "FERTILIZER",
      brand: "DeltaBio",
      packageSize: "50 kg sack",
      unitPrice: 750.0,
      stockQuantity: 300,
      isOrganic: true,
      description: "Naturally fermented compost enriched with Azospirillum, Phosphobacteria, and Trichoderma.",
    },
    {
      name: "Cold-Pressed Neem Oil 10,000 PPM [DEMO]",
      category: "ORGANIC_PESTICIDE",
      brand: "GreenGuard",
      packageSize: "1 Liter Bottle",
      unitPrice: 420.0,
      stockQuantity: 85,
      isOrganic: true,
      description: "Certified organic botanical repellent for leaf-folders, stem borers, and sucking pests.",
    },
    {
      name: "Gravity Drip Irrigation Kit (1 Acre Unit) [DEMO]",
      category: "IRRIGATION",
      brand: "Jain Compatible",
      packageSize: "Box Set",
      unitPrice: 14500.0,
      stockQuantity: 15,
      isOrganic: false,
      description: "Complete pressure-compensated dripline system with filter, valves, and lateral pipes.",
    },
  ];

  for (const prod of products) {
    const existing = await prisma.inputProduct.findFirst({
      where: { supplierId: supplierProfile.id, name: prod.name },
    });
    if (!existing) {
      await prisma.inputProduct.create({
        data: {
          supplierId: supplierProfile.id,
          ...prod,
        },
      });
    }
  }

  // 4. Buyer Profile & Listings
  await prisma.buyerProfile.upsert({
    where: { userId: buyer.id },
    update: {},
    create: {
      userId: buyer.id,
      businessName: "Sundaram Wholesale Grain Merchants [DEMO]",
      buyerType: "MANDI_TRADER",
      gstNumber: "33AABCS1234D1Z5",
      preferredCrops: "Ponni Paddy, BPT 5204, Turmeric, Black Gram",
      district: "Madurai",
      isVerified: true,
    },
  });

  // 5. Machinery Inventory
  const machines = [
    {
      name: "John Deere 5050D 50HP Tractor with Rotavator [DEMO]",
      category: "TRACTOR",
      modelYear: 2023,
      specs: "50 HP, 4-Wheel Drive, Heavy Duty Multi-Speed Rotavator, Laser Leveler compatible",
      rateType: "HOURLY",
      rentalRate: 950.0,
      district: "Thanjavur",
      serviceRadiusKm: 30.0,
      providesOperator: true,
      fuelIncluded: false,
      isAvailable: true,
    },
    {
      name: "Agras 16L Agriculture Drone Sprayer [DEMO]",
      category: "DRONE",
      modelYear: 2024,
      specs: "16-Liter liquid payload, Centrifugal Atomization, 5 acres/hour coverage with DGCA licensed pilot",
      rateType: "PER_ACRE",
      rentalRate: 550.0,
      district: "Thanjavur",
      serviceRadiusKm: 45.0,
      providesOperator: true,
      fuelIncluded: true,
      isAvailable: true,
    },
    {
      name: "Kubota DC-68G Combine Paddy Harvester [DEMO]",
      category: "HARVESTER",
      modelYear: 2022,
      specs: "Rubber crawler tracks, low ground pressure, high threshing efficiency in wet delta fields",
      rateType: "HOURLY",
      rentalRate: 2400.0,
      district: "Thanjavur",
      serviceRadiusKm: 40.0,
      providesOperator: true,
      fuelIncluded: true,
      isAvailable: true,
    },
  ];

  for (const m of machines) {
    const existing = await prisma.machinery.findFirst({
      where: { ownerId: machineryOwner.id, name: m.name },
    });
    if (!existing) {
      await prisma.machinery.create({
        data: {
          ownerId: machineryOwner.id,
          ...m,
        },
      });
    }
  }

  // 6. Transport Fleet
  const vehicles = [
    {
      vehicleNumber: "TN 49 AC 7890",
      vehicleType: "3_TON_TRUCK",
      capacityTons: 3.5,
      isRefrigerated: false,
      baseDistrict: "Thanjavur",
      ratePerKm: 35.0,
      isAvailable: true,
    },
    {
      vehicleNumber: "TN 49 Z 4321",
      vehicleType: "10_TON_GRAIN_LORRY",
      capacityTons: 10.0,
      isRefrigerated: false,
      baseDistrict: "Thanjavur",
      ratePerKm: 65.0,
      isAvailable: true,
    },
  ];

  for (const v of vehicles) {
    const existing = await prisma.transportVehicle.findFirst({
      where: { transporterId: transporter.id, vehicleNumber: v.vehicleNumber },
    });
    if (!existing) {
      await prisma.transportVehicle.create({
        data: {
          transporterId: transporter.id,
          ...v,
        },
      });
    }
  }

  // 7. Landowner Farm & Land Records
  let landownerFarm = await prisma.farm.findFirst({
    where: { ownerId: landowner.id, name: "Thiruvaiyaru Riverbank Farmlands [DEMO]" },
  });

  if (!landownerFarm) {
    landownerFarm = await prisma.farm.create({
      data: {
        ownerId: landowner.id,
        name: "Thiruvaiyaru Riverbank Farmlands [DEMO]",
        surveyNumber: "142/3B",
        locationName: "Kandiyur, Thiruvaiyaru Taluk",
        district: "Thanjavur",
        state: "Tamil Nadu",
        totalAcres: 14.5,
        soilType: "Alluvial Red Loam",
        waterSource: "Cauvery Canal + 15 HP Submersible Borewell",
        powerSource: "Free Solar + 3-Phase Grid",
        fencingStatus: "Barbed Wire Fenced",
        isOrganic: true,
      },
    });

    await prisma.landRecord.create({
      data: {
        ownerId: landowner.id,
        farmId: landownerFarm.id,
        titleNumber: "PATTA-TN-49-2024-9812",
        acresAvailable: 8.0,
        soilPh: 6.8,
        leaseType: "SHARECROPPING",
        expectedRentPerAcre: 18000.0,
        leaseDurationMonths: 12,
        isVerified: true,
        notes: "Prime river silt soil ideal for Kuruvai paddy or banana cultivation. Canal sluice at boundary.",
      },
    });
  }

  // 8. Farmer's Farm & Comprehensive Farm Project
  let farmerFarm = await prisma.farm.findFirst({
    where: { ownerId: farmer.id, name: "Selvam Organic Delta Farms [DEMO]" },
  });

  if (!farmerFarm) {
    farmerFarm = await prisma.farm.create({
      data: {
        ownerId: farmer.id,
        name: "Selvam Organic Delta Farms [DEMO]",
        surveyNumber: "88/1A",
        locationName: "Ammapettai, Papanasam Road",
        district: "Thanjavur",
        state: "Tamil Nadu",
        totalAcres: 6.0,
        soilType: "Clay Loam",
        waterSource: "Perennial Borewell + Drip Ready",
        powerSource: "Grid 3-Phase",
        fencingStatus: "Fenced",
        isOrganic: true,
      },
    });
  }

  let project = await prisma.farmProject.findFirst({
    where: { farmerId: farmer.id, title: "Kuruvai Organic Ponni Paddy Project 2026 [DEMO]" },
  });

  if (!project) {
    project = await prisma.farmProject.create({
      data: {
        farmerId: farmer.id,
        farmId: farmerFarm.id,
        title: "Kuruvai Organic Ponni Paddy Project 2026 [DEMO]",
        description: "Zero-chemical cultivation of premium Deluxe Ponni paddy using SRI method, Jeevamrutham, and mechanized transplantation.",
        cropName: "Paddy",
        variety: "Deluxe Ponni (BPT 5204)",
        season: "Kuruvai",
        acresAllotted: 5.0,
        expectedSowingDate: new Date("2026-06-15"),
        expectedHarvestDate: new Date("2026-10-25"),
        targetYieldKg: 12500.0,
        projectedRevenue: 375000.0,
        estimatedBudget: 145000.0,
        status: "RESOURCE_ACQUISITION",
      },
    });

    // 9. Resource Gaps for the Project (Core AgriBridge Engine)
    await prisma.resourceGap.createMany({
      data: [
        {
          projectId: project.id,
          category: "FUNDING",
          title: "Working Capital for Organic Inputs & Nursery Preparation",
          quantityNeeded: 65000.0,
          unit: "INR",
          urgency: "HIGH",
          deadline: new Date("2026-06-01"),
          status: "OPEN",
          notes: "Seeking ₹65,000 working capital in exchange for 20% net crop revenue share upon harvest.",
        },
        {
          projectId: project.id,
          category: "LABOUR",
          title: "Skilled Transplanting & Leveling Gang",
          quantityNeeded: 6.0,
          unit: "Workers",
          urgency: "HIGH",
          deadline: new Date("2026-06-20"),
          status: "OPEN",
          notes: "Need 6 workers for systematic SRI spacing line transplanting over 3 days.",
        },
        {
          projectId: project.id,
          category: "MACHINERY",
          title: "4WD Tractor with Puddler and Rotavator",
          quantityNeeded: 16.0,
          unit: "Hours",
          urgency: "MEDIUM",
          deadline: new Date("2026-06-10"),
          status: "OPEN",
          notes: "Wet puddle preparation for 5 acres of fine delta soil.",
        },
        {
          projectId: project.id,
          category: "INPUTS",
          title: "Organic NPK Fertilizer & Bio-Inoculants",
          quantityNeeded: 15.0,
          unit: "Sacks",
          urgency: "MEDIUM",
          deadline: new Date("2026-06-05"),
          status: "OPEN",
          notes: "Enriched compost, Trichoderma viride and Pseudomonas.",
        },
        {
          projectId: project.id,
          category: "BUYER",
          title: "Pre-Harvest Forward Buyer for Organic Ponni Paddy",
          quantityNeeded: 12000.0,
          unit: "Kg",
          urgency: "MEDIUM",
          deadline: new Date("2026-10-15"),
          status: "OPEN",
          notes: "Looking for certified organic wholesaler or mill offer at ₹30/kg minimum floor price.",
        },
        {
          projectId: project.id,
          category: "TRANSPORT",
          title: "Post-Harvest Grain Haulage to Mandi",
          quantityNeeded: 12.5,
          unit: "Tons",
          urgency: "LOW",
          deadline: new Date("2026-10-28"),
          status: "OPEN",
          notes: "Direct haulage from field bund to Madurai Central Grain Terminal.",
        },
      ],
    });

    // 10. Milestones
    await prisma.projectMilestone.createMany({
      data: [
        {
          projectId: project.id,
          title: "Land Puddling, Basal Manuring & Nursery Raising",
          targetDate: new Date("2026-06-10"),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "SRI Line Transplanting & Water Level Tuning",
          targetDate: new Date("2026-06-22"),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Cono-Weeder Aeration & Bio-Pesticide Spray",
          targetDate: new Date("2026-07-25"),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Panicle Initiation & Organic Potassium Nourishment",
          targetDate: new Date("2026-08-30"),
          status: "PENDING",
        },
        {
          projectId: project.id,
          title: "Harvesting, Grain Moisture Testing & Bagging",
          targetDate: new Date("2026-10-25"),
          status: "PENDING",
        },
      ],
    });

    // 11. Budget Breakdown
    await prisma.projectBudget.createMany({
      data: [
        {
          projectId: project.id,
          category: "SEEDS",
          estimatedCost: 8500.0,
          actualCost: 0.0,
          notes: "150 kg certified seed stock",
        },
        {
          projectId: project.id,
          category: "FERTILIZER",
          estimatedCost: 32000.0,
          actualCost: 0.0,
          notes: "Bio-NPK, Jeevamrutham ingredients, Vermicompost",
        },
        {
          projectId: project.id,
          category: "LABOUR",
          estimatedCost: 45000.0,
          actualCost: 0.0,
          notes: "Transplanting, weeding (2 rounds), harvest handling",
        },
        {
          projectId: project.id,
          category: "MACHINERY",
          estimatedCost: 28000.0,
          actualCost: 0.0,
          notes: "Puddling, drone spraying, combine harvester hire",
        },
        {
          projectId: project.id,
          category: "TRANSPORT",
          estimatedCost: 16500.0,
          actualCost: 0.0,
          notes: "Field-to-mandi lorry freight",
        },
        {
          projectId: project.id,
          category: "CONTINGENCY",
          estimatedCost: 15000.0,
          actualCost: 0.0,
          notes: "Buffer for pest outbreak or weather adjustment",
        },
      ],
    });

    // 12. Investment Proposal linked to project
    await prisma.investmentProposal.create({
      data: {
        projectId: project.id,
        farmerId: farmer.id,
        title: "Working Capital Co-Investment: Organic Ponni Paddy 2026 [DEMO]",
        summary: "Join hands with an experienced organic delta farmer for a high-value 5-acre Deluxe Ponni paddy cycle. Clear accounting and pre-negotiated mandi buyer.",
        targetFunding: 65000.0,
        raisedFunding: 0.0,
        minInvestment: 10000.0,
        partnershipType: "PROFIT_SHARE",
        profitSharePercent: 22.5,
        cultivationMonths: 4,
        riskMitigation: "Borewell backup ensures no water shortage. Neem bio-shield prevents pest loss. Escrow simulation for all input disbursements.",
        status: "ACTIVE",
      },
    });

    // 13. Pre-harvest Produce Listing
    await prisma.produceListing.create({
      data: {
        farmerId: farmer.id,
        projectId: project.id,
        cropName: "Organic Deluxe Ponni Paddy",
        variety: "BPT 5204",
        grade: "ORGANIC_CERTIFIED",
        quantityKg: 12000.0,
        minimumOrderKg: 1000.0,
        expectedHarvestDate: new Date("2026-10-25"),
        isPreHarvestListing: true,
        askingPricePerKg: 31.5,
        packagingType: "75 kg Jute Bags",
        locationDistrict: "Thanjavur",
        status: "AVAILABLE",
      },
    });
  }

  // 14. Agricultural Intelligence Data
  const cropIntel = [
    {
      cropName: "Paddy (Rice)",
      recommendedSoil: "Clay loam, Alluvial heavy soil with water retention",
      waterRequirement: "High",
      seasonTamilNadu: "Kuruvai (Jun-Sep), Samba (Aug-Jan), Thaladi (Sep-Feb)",
      growthDurationDays: 125,
      avgYieldPerAcreKg: 2400.0,
      avgCostPerAcreInr: 28000.0,
      baseSellingPricePerKg: 23.5,
      risksAndMitigation: "Stem borer, blast disease, unseasonal rain at harvest. Use trichogramma cards and proper drainage channels.",
    },
    {
      cropName: "Turmeric (Manjal)",
      recommendedSoil: "Well drained friable loamy or alluvial soil, rich in organic matter",
      waterRequirement: "Medium",
      seasonTamilNadu: "Aadi Pattam (May-Jun planting)",
      growthDurationDays: 270,
      avgYieldPerAcreKg: 8500.0,
      avgCostPerAcreInr: 65000.0,
      baseSellingPricePerKg: 95.0,
      risksAndMitigation: "Rhizome rot in waterlogged fields. Ensure ridge and furrow planting and bio-fungicide drenching.",
    },
    {
      cropName: "Tomato",
      recommendedSoil: "Sandy loam to medium black soil with pH 6.0 to 7.0",
      waterRequirement: "Medium",
      seasonTamilNadu: "Year-Round (May-Jun, Nov-Dec best)",
      growthDurationDays: 100,
      avgYieldPerAcreKg: 14000.0,
      avgCostPerAcreInr: 45000.0,
      baseSellingPricePerKg: 18.0,
      risksAndMitigation: "Leaf curl virus, early blight, extreme price volatility. Intercrop with marigold and arrange forward buyer agreements.",
    },
    {
      cropName: "Banana (Grand Naine)",
      recommendedSoil: "Deep, rich loamy soil with neutral pH and excellent drainage",
      waterRequirement: "High",
      seasonTamilNadu: "Year-Round (Feb-Apr, Jul-Aug best)",
      growthDurationDays: 330,
      avgYieldPerAcreKg: 25000.0,
      avgCostPerAcreInr: 85000.0,
      baseSellingPricePerKg: 16.0,
      risksAndMitigation: "Gale force winds during monsoon. Prop plants with bamboo poles. Ensure drip fertigation.",
    },
  ];

  for (const intel of cropIntel) {
    await prisma.agriculturalIntelligence.upsert({
      where: { cropName: intel.cropName },
      update: intel,
      create: intel,
    });
  }

  console.log("✅ Seed complete! All 9 personas, demo farm, projects, resource gaps, and crop intelligence seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
