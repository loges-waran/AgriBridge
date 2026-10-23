import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerificationDecisionButton } from "@/components/admin/VerificationDecisionButton";

export const dynamic = "force-dynamic";

export default async function AdminVerificationsPage() {
  const user = await getCurrentUser();
  if (!user || (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN"))) redirect("/login");

  const users = await prisma.user.findMany({
    include: { roles: true },
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
              Stakeholder KYC & Document Verification Queue
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Review Aadhaar, PAN, Land Patta, and trade license credentials to grant verified marketplace status
            </p>
          </div>
        </div>

        <div className="agri-card p-5 mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-3">User Name</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Registered Roles</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="p-3 font-semibold text-stone-900">{u.fullName}</td>
                    <td className="p-3">
                      <div>{u.email}</div>
                      <div className="text-[11px] text-stone-400">{u.phone || "No phone"}</div>
                    </td>
                    <td className="p-3">{u.district || "Thanjavur"}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r.id}
                            className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] text-stone-700"
                          >
                            {r.role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={u.kycStatus === "VERIFIED" ? "verified" : u.kycStatus === "REJECTED" ? "urgent" : "pending"}>
                        {u.kycStatus}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <VerificationDecisionButton targetUserId={u.id} currentStatus={u.kycStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
