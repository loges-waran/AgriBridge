import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { LabourJobSchema } from "@/lib/validation";

export async function GET() {
  try {
    const [profiles, jobs] = await Promise.all([
      prisma.labourProfile.findMany({
        where: { isAvailable: true },
        include: { user: true },
      }),
      prisma.labourJob.findMany({
        where: { status: "OPEN" },
        include: { farmer: true, applications: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return NextResponse.json({ profiles, jobs });
  } catch (error) {
    console.error("GET labour error:", error);
    return NextResponse.json({ error: "Failed to fetch labour listings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // If it's a job application
    if (body.type === "APPLICATION") {
      const { jobId, workersCount, notes } = body;
      const application = await prisma.labourApplication.create({
        data: {
          jobId,
          workerId: user.id,
          workersCount: Number(workersCount) || 1,
          notes: notes || null,
          status: "SUBMITTED",
        },
      });
      return NextResponse.json({ success: true, application });
    }

    // Otherwise, it's posting a new job
    const result = LabourJobSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.errors }, { status: 400 });
    }

    const d = result.data;
    const job = await prisma.labourJob.create({
      data: {
        farmerId: user.id,
        projectId: d.projectId || null,
        title: d.title,
        workType: d.workType,
        location: d.location,
        district: d.district,
        workersNeeded: d.workersNeeded,
        wagePerDay: d.wagePerDay,
        startDate: new Date(d.startDate),
        endDate: new Date(d.endDate),
        workingHours: d.workingHours,
        providesFood: d.providesFood,
        providesTransport: d.providesTransport,
        status: "OPEN",
      },
    });

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    console.error("POST labour error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
