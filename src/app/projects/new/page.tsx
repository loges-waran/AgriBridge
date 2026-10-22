"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";
import {
  Sprout,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Coins,
  Users,
  Wrench,
  Package,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NewFarmProjectWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Land Data
  const [landData, setLandData] = useState({
    district: user?.district || "Thanjavur",
    acresAllotted: 5.0,
    soilType: "Clay Loam",
    waterSource: "Perennial Borewell + Canal",
    powerSource: "Grid 3-Phase",
    fencingStatus: "Fenced",
  });

  // Step 2: Crop & Cultivation Plan
  const [cropData, setCropData] = useState({
    title: "Kuruvai Deluxe Ponni Paddy 2026",
    description: "Systematic SRI method organic paddy cultivation with mechanised line transplantation and bio-fertilizers.",
    cropName: "Paddy",
    variety: "Deluxe Ponni (BPT 5204)",
    season: "Kuruvai",
    expectedSowingDate: "2026-06-15",
    expectedHarvestDate: "2026-10-25",
    targetYieldKg: 12500,
    projectedRevenue: 375000,
    estimatedBudget: 145000,
  });

  // Step 3: Available Resources
  const [availableResources, setAvailableResources] = useState({
    hasLand: true,
    hasOwnLabor: false,
    hasOwnMachinery: false,
    hasOwnCapital: false,
    hasSeeds: false,
  });

  // Step 4: Missing Resource Gaps
  const [gaps, setGaps] = useState([
    {
      category: "FUNDING",
      title: "Working capital for organic nursery & land preparation",
      quantityNeeded: 65000,
      unit: "INR",
      urgency: "HIGH",
    },
    {
      category: "LABOUR",
      title: "Skilled paddy transplanting gang",
      quantityNeeded: 6,
      unit: "Workers",
      urgency: "HIGH",
    },
    {
      category: "MACHINERY",
      title: "4WD Tractor with Rotavator for puddling",
      quantityNeeded: 16,
      unit: "Hours",
      urgency: "MEDIUM",
    },
  ]);

  const addGap = (category: string) => {
    setGaps([
      ...gaps,
      {
        category,
        title: `Required ${category.toLowerCase()} for ${cropData.cropName}`,
        quantityNeeded: 10,
        unit: category === "FUNDING" ? "INR" : "Units",
        urgency: "MEDIUM",
      },
    ]);
  };

  const removeGap = (index: number) => {
    setGaps(gaps.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: cropData.title,
        description: cropData.description,
        cropName: cropData.cropName,
        variety: cropData.variety,
        season: cropData.season,
        acresAllotted: Number(landData.acresAllotted),
        expectedSowingDate: cropData.expectedSowingDate,
        expectedHarvestDate: cropData.expectedHarvestDate,
        targetYieldKg: Number(cropData.targetYieldKg),
        projectedRevenue: Number(cropData.projectedRevenue),
        estimatedBudget: Number(cropData.estimatedBudget),
        resourceGaps: gaps,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create farm project");
      }

      router.push(`/projects/${data.project.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span>Stage {step} of 5</span>
            <span>
              {step === 1 && "Land & Location"}
              {step === 2 && "Crop & Cultivation Plan"}
              {step === 3 && "Available Assets"}
              {step === 4 && "Declare Missing Resource Gaps"}
              {step === 5 && "Review & Submit Project"}
            </span>
          </div>
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#24593c] h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: LAND & LOCATION */}
        {step === 1 && (
          <div className="agri-card p-6 bg-white space-y-4">
            <div className="pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">Step 1: Land & Water Information</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Specify the plot boundaries, soil profile, and irrigation sources for this project.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  District / Farming Cluster
                </label>
                <select
                  value={landData.district}
                  onChange={(e) => setLandData({ ...landData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                >
                  <option value="Thanjavur">Thanjavur (Cauvery Delta)</option>
                  <option value="Thiruvarur">Thiruvarur</option>
                  <option value="Nagapattinam">Nagapattinam</option>
                  <option value="Tiruchirappalli">Tiruchirappalli</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Salem">Salem</option>
                  <option value="Erode">Erode</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Area Allotted for this Project (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={landData.acresAllotted}
                  onChange={(e) => setLandData({ ...landData, acresAllotted: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Soil Classification
                </label>
                <select
                  value={landData.soilType}
                  onChange={(e) => setLandData({ ...landData, soilType: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                >
                  <option value="Clay Loam">Clay Loam (Heavy water retention)</option>
                  <option value="Alluvial Red Loam">Alluvial Red Loam (River silt)</option>
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Sandy Loam">Sandy Loam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Irrigation / Water Source
                </label>
                <select
                  value={landData.waterSource}
                  onChange={(e) => setLandData({ ...landData, waterSource: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                >
                  <option value="Perennial Borewell + Canal">Perennial Borewell + Canal</option>
                  <option value="Borewell Only">Borewell Only</option>
                  <option value="Canal Sluice Only">Canal Sluice Only</option>
                  <option value="Rainfed / Tank">Rainfed / Tank</option>
                  <option value="Drip Irrigation Ready">Drip Irrigation Ready</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setStep(2)}>
                {t.common.next} →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: CROP & CULTIVATION PLAN */}
        {step === 2 && (
          <div className="agri-card p-6 bg-white space-y-4">
            <div className="pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">Step 2: Crop & Cultivation Plan</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Define the crop cycle, season, harvest timeline, and financial expectations.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                required
                value={cropData.title}
                onChange={(e) => setCropData({ ...cropData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                placeholder="e.g. Kuruvai Deluxe Ponni Paddy 2026"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Crop
                </label>
                <select
                  value={cropData.cropName}
                  onChange={(e) => setCropData({ ...cropData, cropName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                >
                  <option value="Paddy">Paddy (Rice)</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Banana">Banana</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Groundnut">Groundnut</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Variety / Seed Type
                </label>
                <input
                  type="text"
                  value={cropData.variety}
                  onChange={(e) => setCropData({ ...cropData, variety: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                  placeholder="e.g. BPT 5204 (Deluxe Ponni)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Season
                </label>
                <select
                  value={cropData.season}
                  onChange={(e) => setCropData({ ...cropData, season: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                >
                  <option value="Kuruvai">Kuruvai (Jun - Sep)</option>
                  <option value="Samba">Samba (Aug - Jan)</option>
                  <option value="Navarai">Navarai (Dec - Apr)</option>
                  <option value="Year-round">Year-round</option>
                </select>
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expected Sowing Date
                </label>
                <input
                  type="date"
                  required
                  value={cropData.expectedSowingDate}
                  onChange={(e) => setCropData({ ...cropData, expectedSowingDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Expected Harvest Window
                </label>
                <input
                  type="date"
                  required
                  value={cropData.expectedHarvestDate}
                  onChange={(e) => setCropData({ ...cropData, expectedHarvestDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Yield (Kg)
                </label>
                <input
                  type="number"
                  value={cropData.targetYieldKg}
                  onChange={(e) => setCropData({ ...cropData, targetYieldKg: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Estimated Cultivation Budget (₹)
                </label>
                <input
                  type="number"
                  value={cropData.estimatedBudget}
                  onChange={(e) => setCropData({ ...cropData, estimatedBudget: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Projected Gross Revenue (₹)
                </label>
                <input
                  type="number"
                  value={cropData.projectedRevenue}
                  onChange={(e) => setCropData({ ...cropData, projectedRevenue: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                ← {t.common.back}
              </Button>
              <Button onClick={() => setStep(3)}>
                {t.common.next} →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: AVAILABLE RESOURCES */}
        {step === 3 && (
          <div className="agri-card p-6 bg-white space-y-4">
            <div className="pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">Step 3: What Do You Already Have?</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Mark the resources you already control. Unchecked items will be automatically queued as resource gaps.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "hasLand", label: "Farmland (Owned or already leased)", desc: `${landData.acresAllotted} acres ready for preparation` },
                { id: "hasOwnLabor", label: "Adequate Farm Labor / Family Labor", desc: "No need to hire external transplanting or harvest gangs" },
                { id: "hasOwnMachinery", label: "Tractors / Rotavators / Harvesters", desc: "Own heavy farm equipment available on schedule" },
                { id: "hasOwnCapital", label: "Complete Working Capital", desc: `Have ₹${cropData.estimatedBudget.toLocaleString()} in cash for seeds, inputs, and expenses` },
                { id: "hasSeeds", label: "Certified Seed Stock / Inputs", desc: "Seeds and bio-fertilizers already procured" },
              ].map((item) => {
                const checked = (availableResources as any)[item.id];
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      checked
                        ? "bg-[#f0f7f2] border-[#24593c] text-stone-900"
                        : "bg-stone-50 border-stone-200 text-stone-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setAvailableResources({
                          ...availableResources,
                          [item.id]: e.target.checked,
                        })
                      }
                      className="mt-0.5 rounded text-[#24593c] focus:ring-[#24593c]"
                    />
                    <div>
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className="text-[11px] text-stone-500">{item.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                ← {t.common.back}
              </Button>
              <Button onClick={() => setStep(4)}>
                {t.common.next} →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: MISSING RESOURCE GAPS (CORE AGRIBRIDGE ENGINE) */}
        {step === 4 && (
          <div className="agri-card p-6 bg-white space-y-4">
            <div className="pb-3 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Step 4: Declare Missing Resource Requirements
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  The AgriBridge Resource Gap Engine will find verified marketplace partners for each declared gap.
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => addGap("FUNDING")}
                  className="px-2 py-1 text-[11px] font-semibold bg-amber-50 text-amber-800 rounded border border-amber-200"
                >
                  + Capital
                </button>
                <button
                  type="button"
                  onClick={() => addGap("LABOUR")}
                  className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 rounded border border-emerald-200"
                >
                  + Labour
                </button>
                <button
                  type="button"
                  onClick={() => addGap("MACHINERY")}
                  className="px-2 py-1 text-[11px] font-semibold bg-blue-50 text-blue-800 rounded border border-blue-200"
                >
                  + Machine
                </button>
                <button
                  type="button"
                  onClick={() => addGap("INPUTS")}
                  className="px-2 py-1 text-[11px] font-semibold bg-teal-50 text-teal-800 rounded border border-teal-200"
                >
                  + Inputs
                </button>
                <button
                  type="button"
                  onClick={() => addGap("BUYER")}
                  className="px-2 py-1 text-[11px] font-semibold bg-purple-50 text-purple-800 rounded border border-purple-200"
                >
                  + Buyer
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {gaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{gap.category}</span>
                      <span className="text-[11px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                        {gap.urgency} Urgency
                      </span>
                    </div>
                    <input
                      type="text"
                      value={gap.title}
                      onChange={(e) => {
                        const newG = [...gaps];
                        newG[idx].title = e.target.value;
                        setGaps(newG);
                      }}
                      className="w-full px-2 py-1 text-xs border border-stone-300 rounded bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div>
                      <span className="block text-[10px] text-stone-500 uppercase">Quantity</span>
                      <input
                        type="number"
                        value={gap.quantityNeeded || 0}
                        onChange={(e) => {
                          const newG = [...gaps];
                          newG[idx].quantityNeeded = parseFloat(e.target.value);
                          setGaps(newG);
                        }}
                        className="w-20 px-2 py-1 text-xs border border-stone-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 uppercase">Unit</span>
                      <input
                        type="text"
                        value={gap.unit || ""}
                        onChange={(e) => {
                          const newG = [...gaps];
                          newG[idx].unit = e.target.value;
                          setGaps(newG);
                        }}
                        className="w-16 px-2 py-1 text-xs border border-stone-300 rounded bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGap(idx)}
                      className="text-red-600 hover:text-red-800 font-bold p-1 self-end"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                ← {t.common.back}
              </Button>
              <Button onClick={() => setStep(5)}>
                {t.common.next} →
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: SUMMARY & SUBMISSION */}
        {step === 5 && (
          <div className="agri-card p-6 bg-white space-y-5">
            <div className="pb-3 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-900">Step 5: Review Project Plan</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Confirm your parameters. Upon submission, the Resource Gap Engine will immediately activate matching.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="font-semibold text-stone-700">Project Name:</span>
                <span className="font-bold text-stone-900">{cropData.title}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="font-semibold text-stone-700">Plot Scope:</span>
                <span className="text-stone-900">
                  {landData.acresAllotted} Acres in {landData.district} ({landData.soilType}, {landData.waterSource})
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="font-semibold text-stone-700">Crop Cycle:</span>
                <span className="text-stone-900">
                  {cropData.cropName} ({cropData.variety}) • {cropData.season} Season ({cropData.expectedSowingDate} to {cropData.expectedHarvestDate})
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="font-semibold text-stone-700">Financial Estimates:</span>
                <span className="text-stone-900">
                  Budget: ₹{cropData.estimatedBudget.toLocaleString()} • Projected Revenue: ₹{cropData.projectedRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-stone-700">Resource Gaps Queued:</span>
                <span className="font-bold text-amber-800">{gaps.length} Requirements to Match</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setStep(4)}>
                ← {t.common.back}
              </Button>
              <Button loading={loading} onClick={handleSubmit}>
                {t.forms.submit_project}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
