import React from "react";
import Link from "next/link";
import { Sprout, Shield, Target, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20 bg-[#fbfbfa]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#24593c] uppercase tracking-wider">
            Our Purpose
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-2">
            Bridging Every Agricultural Gap in India
          </h1>
          <p className="mt-3 text-stone-600 text-sm max-w-2xl mx-auto">
            Agriculture is inherently a coordinated multi-stakeholder endeavour. AgriBridge exists to eliminate resource bottlenecks so that no fertile field sits fallow and no farmer is left stranded without labour, capital, or markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="agri-card p-6">
            <div className="w-10 h-10 rounded-md bg-emerald-100 text-[#24593c] flex items-center justify-center mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Our Mission</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Connect every agricultural resource, bridge every farming gap, and make farming opportunities accessible to everyone through verifiable data, transparent contracts, and explainable matching.
            </p>
          </div>

          <div className="agri-card p-6">
            <div className="w-10 h-10 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Non-Negotiable Integrity</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We never fabricate investors, workers, or buyer demands. All marketplace participants undergo KYC verification, and all transactions are recorded in an ACID-compliant relational audit ledger.
            </p>
          </div>
        </div>

        <div className="agri-card p-8 bg-stone-50 border-stone-200">
          <h2 className="text-lg font-bold text-stone-900 mb-3">
            Why We Are Not Just Another Middleman App
          </h2>
          <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
            <p>
              Most existing agriculture apps simply post mandi rates or predict the weather. But when a farmer actually goes to plant 5 acres of Kuruvai paddy, their immediate blockers are practical: <em>Can I get 6 skilled workers next Tuesday? Who has a 4WD tractor available this weekend? Where do I get working capital without 36% moneylender interest?</em>
            </p>
            <p>
              AgriBridge answers these questions with a <strong>Resource Gap Engine</strong> that treats a farm project as an integrated operational venture, coordinating all dependent factors from seed to settlement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
