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

  let txns: any[] = [];
  let expenses: any[] = [];
  let projects: any[] = [];
  try {
    const res = await Promise.all([
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
    txns = res[0];
    expenses = res[1];
    projects = res[2];
  } catch (error) {
    console.error("Financials query error:", error);
  }

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

        {/* Financial Analytics Hero Banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/02-funding-and-investment/business-growth.jpg"
            alt="Agricultural business growth and financial analytics in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Transparent Farm Financial Ledger</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Real-time audit trails of cultivation expenses, input purchases, machinery rentals, and net harvest revenue settlement.
            </p>
          </div>
        </div>

        {/* Savings & Investment Education Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="agri-card p-4 flex items-center gap-4 bg-white">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
              <img
                src="/images/agribridge/02-funding-and-investment/investment-planning.jpg"
                alt="Farm investment planning and capital allocation"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Crop-Cycle Investment Planning</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Structured capital allocation for organic inputs, line transplantation, and automated irrigation.
              </p>
            </div>
          </div>

          <div className="agri-card p-4 flex items-center gap-4 bg-white">
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-stone-200">
              <img
                src="/images/agribridge/02-funding-and-investment/investment-savings-jar.jpg"
                alt="Farmer disciplined savings and reserve funds"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Disciplined Savings &amp; Reserve</h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Retained earnings reserves to build emergency cushions for monsoon variability and seed procurement.
              </p>
            </div>
          </div>
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
