import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, CheckCircle2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DisputeResolutionButton } from "@/components/admin/DisputeResolutionButton";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  const user = await getCurrentUser();
  if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) redirect("/login");

  const complaints = await prisma.complaint.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/admin" className="text-xs text-stone-500 hover:text-stone-900">
                ← Admin Governance
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">
              Grievance & Dispute Mediation Desk
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review filed complaints regarding non-payment, machinery breakdowns, labor attendance, or produce quality
            </p>
          </div>
        </div>

        <div className="agri-card p-5 mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-3">Complainant</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subject & Details</th>
                  <th className="p-3">Filed At</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Mediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-stone-400">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                      No open complaints or disputes on the platform.
                    </td>
                  </tr>
                ) : (
                  complaints.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-semibold text-stone-900">{c.user.fullName}</td>
                      <td className="p-3">
                        <Badge variant="urgent">{c.category}</Badge>
                      </td>
                      <td className="p-3 max-w-sm">
                        <div className="font-semibold text-stone-900">{c.subject}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-2">{c.description}</div>
                        {c.resolution && (
                          <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded mt-1">
                            <strong>Resolution:</strong> {c.resolution}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-stone-400 text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Badge variant={c.status === "RESOLVED" ? "verified" : "urgent"}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        {c.status !== "RESOLVED" && (
                          <DisputeResolutionButton complaintId={c.id} />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
