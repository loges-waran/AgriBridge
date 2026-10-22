import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Users, Plus, MapPin, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LabourJobClientActions } from "@/components/marketplaces/LabourJobClientActions";
import { RESOURCE_IMAGES, getLabourJobImage, getWorkerCrewImage } from "@/lib/imageMap";

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
              <span>Human Capital &amp; Agricultural Workforces</span>
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

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/rice-field-workers.jpg"
            alt="Agricultural workforce harvesting crops in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#1e4731]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Skilled Agricultural Crews</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Connect directly with verified gang leaders for transplantation, de-weeding, harvesting, and post-harvest handling.
            </p>
          </div>
        </div>

        {/* 1. Open Job Listings */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-stone-900">
              Open Farm Work Opportunities ({jobs.length} Positions)
            </h2>
            <span className="text-xs text-stone-500">
              Daily &amp; Milestone Agricultural Labor Requirements
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

                  {(() => {
                    const jobImg = getLabourJobImage(job.id);
                    return (
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                          <img
                            src={jobImg.src}
                            alt={jobImg.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-stone-900">{job.title}</h3>
                          <p className="text-xs text-stone-500">
                            Farmer: {job.farmer.fullName.split("[")[0]} • {job.district}
                          </p>
                        </div>
                      </div>
                    );
                  })()}

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
                  <Link
                    href="/login"
                    className="font-semibold text-[#24593c] hover:underline"
                  >
                    Apply for Job →
                  </Link>
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
              Direct Contact with Gang Leaders &amp; Experienced Farm Hands
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map((p) => (
              <div
                key={p.id}
                className="agri-card p-5 flex flex-col justify-between text-xs hover:border-[#24593c] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                  {(() => {
                    const crewImg = getWorkerCrewImage(p.id);
                    return (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-200 shrink-0 bg-emerald-50">
                          <img
                            src={crewImg.src}
                            alt={crewImg.alt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">
                            {p.user.fullName.split("[")[0]}
                          </span>
                          <span className="text-[11px] text-stone-500">Crew of {p.crewSize} Workers</span>
                        </div>
                      </div>
                    );
                  })()}
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
