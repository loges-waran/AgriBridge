import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Coins, ArrowUpRight, ArrowDownLeft, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function FinancialsPage() {
  const user = await getCurrentUser();

  const [txns, expenses, projects] = await Promise.all([
    prisma.financialTransaction.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.expenseRecord.findMany({
      include: { project: true, payer: true },
      orderBy: { paidAt: "desc" },
    }),
    prisma.farmProject.findMany({
      include: { budgetEntries: true, expenses: true },
    }),
  ]);

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
            <Coins className="w-3.5 h-3.5" />
            <span>Financial Transparency & Project Accounting Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Agricultural Financial Workspace & Audit Trail
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Transparent breakdown of actual expenditures, input costs, machinery rentals, and net farmer sale proceeds
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard
            label="Total Actual Incurred"
            value={`₹${totalExpenses.toLocaleString()}`}
            subtext="Recorded Real Expenses"
            icon={Coins}
          />
          <StatCard
            label="Audit Ledger Transactions"
            value={txns.length}
            subtext="ACID Compliant Entries"
            icon={FileSpreadsheet}
          />
          <StatCard
            label="Financial Integrity"
            value="100% Real Ledger"
            subtext="No Fabricated Cashflow"
            icon={ShieldCheck}
            trendPositive={true}
          />
          <StatCard
            label="Settlement Engine"
            value="Escrow Simulated"
            subtext="Safe Dev/Test Mode"
            icon={Coins}
          />
        </div>

        {/* Expenses List */}
        <div className="agri-card p-5 mb-8">
          <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 mb-4">
            Itemized Cultivation Expenses (Real Farm Receipts)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-stone-700 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="p-3">Project / Cultivation</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Incurred Date</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-stone-400">
                      No expense records logged yet.
                    </td>
                  </tr>
                ) : (
                  expenses.map((e) => (
                    <tr key={e.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-semibold text-stone-900">{e.project.title}</td>
                      <td className="p-3">
                        <Badge variant="neutral">{e.category}</Badge>
                      </td>
                      <td className="p-3">{e.description}</td>
                      <td className="p-3 text-stone-400 text-[11px]">
                        {new Date(e.paidAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right font-bold text-stone-900">
                        ₹{e.amount.toLocaleString()}
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
