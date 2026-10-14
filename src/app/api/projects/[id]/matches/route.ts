import { NextResponse } from "next/server";
import { findMatchesForProject } from "@/lib/matching";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const matches = await findMatchesForProject(id);
    return NextResponse.json({ success: true, ...matches });
  } catch (error: any) {
    console.error("Match engine error:", error);
    return NextResponse.json({ error: error.message || "Failed to compute matches" }, { status: 500 });
  }
}
