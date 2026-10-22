import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, CheckCircle2, Clock, MapPin, Calendar, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function WorkerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [profile, applications, openJobs] = await Promise.all([
    prisma.labourProfile.findUnique({
      where: { userId: user.id },
    }),
    prisma.labourApplication.findMany({
      where: { workerId: user.id },
      include: {
        job: { include: { farmer: true } },
      },
    }),
    prisma.labourJob.findMany({
      where: { status: "OPEN" },
      include: { farmer: true },
      take: 5,
    }),
  ]);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                Worker Portal: {user.fullName.split("[")[0]}
              </h1>
              <Badge variant={profile?.isAvailable ? "verified" : "neutral"}>
                {profile?.isAvailable ? "Available for Work" : "Currently Engaged"}
              </Badge>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              District: {user.district || "Thiruvarur"} • Crew Leader ({profile?.crewSize || 6} Worker Gang)
            </p>
          </div>

          <Link
            href="/marketplaces/labour"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
          >
            <span>Browse Open Farm Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/rice-field-workers.jpg"
            alt="Agricultural workforce and labour gang in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#1e4731]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Agricultural Labour &amp; Crew Workspace</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Discover direct transplanting, weeding, and harvesting bookings with transparent daily wages and verified farm locations.
            </p>
          </div>
        </div>

        {/* Worker Profile Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard
            label="Daily Wage Rate"
            value={`₹${profile?.dailyWageRate || 650}`}
            subtext="Per Worker / Day"
            icon={Users}
          />
          <StatCard
            label="Gang Size"
            value={`${profile?.crewSize || 6} Workers`}
            subtext="Trained Farm Hands"
            icon={CheckCircle2}
          />
          <StatCard
            label="Operating Radius"
            value={`${profile?.serviceRadiusKm || 25} km`}
            subtext={user.district || "Thiruvarur"}
            icon={MapPin}
          />
          <StatCard
            label="Active Applications"
            value={applications.length}
            subtext="Submitted Bids"
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Open Farm Jobs nearby (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="agri-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-sm font-bold text-stone-900">
                  Open Farm Jobs in Your Service Area
                </h3>
                <Link
                  href="/marketplaces/labour"
                  className="text-xs font-semibold text-[#24593c] hover:underline"
                >
                  View All Jobs
                </Link>
              </div>

              {openJobs.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">
                  No open jobs posted in your district currently. Check back soon.
                </p>
              ) : (
                <div className="space-y-4">
                  {openJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-lg border border-stone-200 bg-white hover:border-[#24593c] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">{job.title}</h4>
                          <p className="text-xs text-stone-500">
                            Farmer: {job.farmer.fullName.split("[")[0]} • Location: {job.location} ({job.district})
                          </p>
                        </div>
                        <span className="text-sm font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ₹{job.wagePerDay}/day
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-stone-600 my-2">
                        <span>Workers Needed: <strong>{job.workersNeeded}</strong></span>
                        <span>Hours: <strong>{job.workingHours}</strong></span>
                        <span>Food: <strong>{job.providesFood ? "Provided" : "Self"}</strong></span>
                        <span>Transport: <strong>{job.providesTransport ? "Provided" : "Self"}</strong></span>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-400">
                          Starts: {new Date(job.startDate).toLocaleDateString()}
                        </span>
                        <Link
                          href="/marketplaces/labour"
                          className="font-semibold text-[#24593c] hover:underline"
                        >
                          Apply as Gang Leader →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Skills & Application History */}
          <div className="space-y-6">
            <div className="agri-card p-5">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
                  <img
                    src="/images/agribridge/01-farm-projects/tamilnadu-farmer.jpg"
                    alt="Authentic Tamil Nadu agricultural worker"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    {user.fullName.split("[")[0]}
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-medium">Aadhaar KYC Verified Gang Leader</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 mb-2 leading-relaxed">
                <strong>Skills:</strong> {profile?.skills || "Paddy transplanting, weeding, harvest"}
              </p>
              <p className="text-xs text-stone-600 mb-2">
                <strong>Experience:</strong> {profile?.yearsExperience || 8} Years
              </p>
              <p className="text-xs text-stone-500 italic bg-stone-50 p-2 rounded">
                &ldquo;{profile?.availabilityNote || "Available for Kuruvai season"}&rdquo;
              </p>
            </div>

            <div className="agri-card p-5">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-3">
                My Job Applications
              </h3>
              {applications.length === 0 ? (
                <p className="text-xs text-stone-500">No applications submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="p-3 bg-stone-50 rounded border border-stone-200 text-xs">
                      <div className="font-semibold text-stone-900">{app.job.title}</div>
                      <div className="text-stone-500 mt-1">
                        Status: <Badge variant="open">{app.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
