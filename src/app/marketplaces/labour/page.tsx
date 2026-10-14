import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Users, Plus, MapPin, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LabourJobClientActions } from "@/components/marketplaces/LabourJobClientActions";

export const dynamic = "force-dynamic";

export default async function LabourMarketplacePage() {
  const user = await getCurrentUser();

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

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcf0e2] text-[#1e4731] text-xs font-semibold mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Human Capital & Agricultural Workforces</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Agricultural Labour Marketplace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Hire verified farm labor gangs or discover daily/seasonal agricultural jobs across Tamil Nadu
            </p>
          </div>

          <LabourJobClientActions currentUser={user} />
        </div>

        {/* 1. Open Job Listings */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">
              Open Farm Work Opportunities ({jobs.length} Positions)
            </h2>
            <span className="text-xs text-stone-500">
              Daily & Milestone Agricultural Labor Requirements
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="agri-card p-5 flex flex-col justify-between hover:border-[#24593c] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                      ₹{job.wagePerDay} / day
                    </span>
                    <Badge variant="open">{job.workersNeeded} Workers Needed</Badge>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-1">{job.title}</h3>
                  <p className="text-xs text-stone-500 mb-3">
                    Farmer: {job.farmer.fullName.split("[")[0]} • {job.location} ({job.district})
                  </p>

                  <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1 text-xs text-stone-600 mb-4">
                    <div>
                      Work Type: <strong>{job.workType}</strong>
                    </div>
                    <div>
                      Hours: <strong>{job.workingHours}</strong>
                    </div>
                    <div>
                      Start Date: <strong>{new Date(job.startDate).toLocaleDateString()}</strong>
                    </div>
                    <div className="text-[11px] text-stone-500 pt-1">
                      Food: {job.providesFood ? "Provided" : "Self"} • Transport:{" "}
                      {job.providesTransport ? "Provided" : "Self"}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    {job.applications.length} Application{job.applications.length !== 1 ? "s" : ""}
                  </span>
                  <button
                    disabled={!user}
                    onClick={() => {
                      alert(`To apply for '${job.title}', please click 'Apply as Gang Leader' or log in as a Worker.`);
                    }}
                    className="font-semibold text-[#24593c] hover:underline"
                  >
                    Apply for Job →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Registered Worker Gangs */}
        <div className="pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">
              Registered Agricultural Labour Gangs ({profiles.length} Verified Crews)
            </h2>
            <span className="text-xs text-stone-500">
              Direct Contact with Gang Leaders & Experienced Farm Hands
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="agri-card p-5 flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {p.user.fullName.split("[")[0]} (Crew of {p.crewSize})
                    </span>
                    <Badge variant={p.isAvailable ? "verified" : "neutral"}>
                      {p.isAvailable ? "Available" : "Engaged"}
                    </Badge>
                  </div>

                  <p className="text-stone-600 mb-2">
                    Wage Rate: <strong>₹{p.dailyWageRate}/day</strong> • Radius:{" "}
                    <strong>{p.serviceRadiusKm} km</strong> ({p.user.district})
                  </p>

                  <div className="bg-stone-50 p-2.5 rounded border border-stone-100 text-stone-600 mb-3 space-y-1">
                    <div>
                      <strong>Skills:</strong> {p.skills}
                    </div>
                    <div>
                      <strong>Experience:</strong> {p.yearsExperience} Years in Delta Agriculture
                    </div>
                  </div>

                  {p.availabilityNote && (
                    <p className="text-[11px] text-stone-500 italic mb-2">
                      &ldquo;{p.availabilityNote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aadhaar KYC Verified
                  </span>
                  <span className="font-semibold text-[#24593c]">Direct Booking Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
