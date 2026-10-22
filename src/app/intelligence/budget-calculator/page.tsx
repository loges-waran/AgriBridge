"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Coins, Calculator, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function BudgetCalculatorPage() {
  const [acres, setAcres] = useState(5);
  const [crop, setCrop] = useState("Paddy");
  const [seedCostPerAcre, setSeedCostPerAcre] = useState(1800);
  const [fertilizerCostPerAcre, setFertilizerCostPerAcre] = useState(6500);
  const [labourCostPerAcre, setLabourCostPerAcre] = useState(9000);
  const [machineryCostPerAcre, setMachineryCostPerAcre] = useState(5500);
  const [transportCostPerAcre, setTransportCostPerAcre] = useState(3000);
  const [expectedYieldKgPerAcre, setExpectedYieldKgPerAcre] = useState(2500);
  const [mandiPricePerKg, setMandiPricePerKg] = useState(24);

  const totalCostPerAcre =
    seedCostPerAcre +
    fertilizerCostPerAcre +
    labourCostPerAcre +
    machineryCostPerAcre +
    transportCostPerAcre;

  const totalProjectCost = totalCostPerAcre * acres;
  const baseRevenue = expectedYieldKgPerAcre * mandiPricePerKg * acres;
  const baseProfit = baseRevenue - totalProjectCost;

  // Scenarios
  const conservativeProfit = baseRevenue * 0.85 - totalProjectCost;
  const optimisticProfit = baseRevenue * 1.15 - totalProjectCost;

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-1 border border-emerald-200">
            <Calculator className="w-3.5 h-3.5" />
            <span>Farm Economics & Financial Scenario Modeling</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Agricultural Budget & Profitability Calculator
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Model input costs, labor requirements, machinery rental, and project net revenue scenarios
          </p>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-32 sm:h-40">
          <img
            src="/images/agribridge/02-funding-and-investment/investment-market-growth.jpg"
            alt="Agricultural economics and investment market growth in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-[#24593c]/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Agronomic Cost &amp; Revenue Projection</p>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Evaluate per-acre operational budgets, sensitivity margins, and projected mandi profit before sowing.
            </p>
          </div>
        </div>

        {/* Hypothetical Notice */}
        <div className="my-6 p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> This calculator generates hypothetical planning estimates based on user assumptions. Realized outcomes depend on biological crop conditions and verified recorded sales.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <div className="agri-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100">
              Cultivation Cost Assumptions
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Total Acres</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={acres}
                  onChange={(e) => setAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                >
                  <option value="Paddy">Paddy (Rice)</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Banana">Banana</option>
                  <option value="Tomato">Tomato</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Seed & Nursery Cost / Acre (₹)
                </label>
                <input
                  type="number"
                  value={seedCostPerAcre}
                  onChange={(e) => setSeedCostPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Bio-NPK & Fertilizer / Acre (₹)
                </label>
                <input
                  type="number"
                  value={fertilizerCostPerAcre}
                  onChange={(e) => setFertilizerCostPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Labour Gang Wages / Acre (₹)
                </label>
                <input
                  type="number"
                  value={labourCostPerAcre}
                  onChange={(e) => setLabourCostPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Machinery & Drone Rentals / Acre (₹)
                </label>
                <input
                  type="number"
                  value={machineryCostPerAcre}
                  onChange={(e) => setMachineryCostPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Haulage & Transport / Acre (₹)
                </label>
                <input
                  type="number"
                  value={transportCostPerAcre}
                  onChange={(e) => setTransportCostPerAcre(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Outputs Section */}
          <div className="space-y-6">
            <div className="agri-card p-6">
              <h3 className="text-sm font-bold text-stone-900 pb-2 border-b border-stone-100 mb-4">
                Revenue & Net Margin Projections
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between p-2.5 bg-stone-50 rounded border border-stone-100">
                  <span className="text-stone-600">Total Cultivation Budget:</span>
                  <strong className="text-stone-900">₹{totalProjectCost.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between p-2.5 bg-stone-50 rounded border border-stone-100">
                  <span className="text-stone-600">Base Expected Revenue:</span>
                  <strong className="text-emerald-800">₹{baseRevenue.toLocaleString()}</strong>
                </div>
              </div>

              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Scenario Sensitivity Analysis
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-700 block">Conservative (-15%)</span>
                    <span className="text-[11px] text-stone-400">Weather delay / lower yield</span>
                  </div>
                  <strong className={conservativeProfit >= 0 ? "text-emerald-700 text-sm" : "text-red-700 text-sm"}>
                    ₹{conservativeProfit.toLocaleString()}
                  </strong>
                </div>

                <div className="p-3 rounded border border-[#24593c] bg-[#f0f7f2] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#24593c] block">Base Plan Scenario</span>
                    <span className="text-[11px] text-[#24593c]/70">Normal seasonal averages</span>
                  </div>
                  <strong className="text-emerald-900 text-sm font-bold">
                    ₹{baseProfit.toLocaleString()}
                  </strong>
                </div>

                <div className="p-3 rounded border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-stone-700 block">Optimistic (+15%)</span>
                    <span className="text-[11px] text-stone-400">Bumper harvest / premium price</span>
                  </div>
                  <strong className="text-emerald-700 text-sm">
                    ₹{optimisticProfit.toLocaleString()}
                  </strong>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100">
                <Link
                  href="/projects/new"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731]"
                >
                  <span>Build Farm Project with these Figures</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
