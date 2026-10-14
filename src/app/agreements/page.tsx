import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { FileText, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function AgreementsPage() {
  const user = await getCurrentUser();

  const agreements = await prisma.agreement.findMany({
    include: { partner: true, project: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Bilateral Agricultural Contracts & Legal Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Agreements & Confirmed Farming Contracts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Documented terms covering landowner leases, co-farming profit shares, labor gangs, and forward produce purchase contracts
          </p>
        </div>

        <div className="space-y-4 my-8">
          {agreements.length === 0 ? (
            <div className="agri-card p-12 text-center text-xs text-stone-500">
              <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="font-semibold text-stone-700">No Bilateral Contracts Finalized Yet</p>
              <p className="mt-1">
                When you accept an investment expression of interest, land lease terms, or produce purchase offer, the binding terms will appear here.
              </p>
            </div>
          ) : (
            agreements.map((a) => (
              <div
                key={a.id}
                className="agri-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="verified">{a.type}</Badge>
                    <h3 className="text-sm font-bold text-stone-900">{a.title}</h3>
                  </div>
                  <p className="text-stone-600 text-xs mb-2 leading-relaxed">{a.termsSummary}</p>
                  <div className="text-stone-400 text-[11px] flex gap-4">
                    <span>Effective: {new Date(a.effectiveDate).toLocaleDateString()}</span>
                    <span>Signatory: {a.partner.fullName}</span>
                    <span>Status: <strong className="text-emerald-800">{a.status}</strong></span>
                  </div>
                </div>

                <Badge variant="verified">Legally Executed</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
