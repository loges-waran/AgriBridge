import React from "react";
import Link from "next/link";
import {
  Sprout,
  Search,
  Handshake,
  CheckCircle,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Register & Verify Identity",
      desc: "Farmers, landowners, workers, suppliers, and traders create an account with verifiable documentation (Aadhaar, Land Patta, or GST trade license) to establish baseline ecosystem trust.",
      icon: CheckCircle,
    },
    {
      num: "02",
      title: "Build the Farm Project & Declare Gaps",
      desc: "A farmer registers land area, soil characteristics, water availability, target crop (e.g. Kuruvai Ponni Paddy), and explicitly lists missing resources: working capital, labour gangs, machinery, inputs, or forward buyers.",
      icon: Sprout,
    },
    {
      num: "03",
      title: "Resource Gap Engine Matches Verified Partners",
      desc: "Our deterministic matching algorithm scores nearby agricultural participants within service radius, comparing skills, machine capacities, and input inventory with transparent match criteria.",
      icon: Search,
    },
    {
      num: "04",
      title: "Establish Legal Terms & Confirmed Bookings",
      desc: "Parties negotiate transparent agreements (profit-share percentages, machine hourly rates, daily wage terms). The state machine locks in confirmed reservations without overlapping conflicts.",
      icon: Handshake,
    },
    {
      num: "05",
      title: "Execute Cultivation & Track Real Expenses",
      desc: "The farm project workspace tracks cultivation milestones, daily attendance, machinery hours, and actual input applications with complete financial ledger transparency.",
      icon: Truck,
    },
    {
      num: "06",
      title: "Harvest, Mandi Dispatch & Reconciliation",
      desc: "Produce is weighed, graded, and dispatched with verified transport. Net proceeds are transparently calculated minus verified deductions, commissions, and platform charges.",
      icon: CreditCard,
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-[#fbfbfa]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#24593c] uppercase tracking-wider">
            Step-by-Step Architecture
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-2">
            How AgriBridge Powers Farming Projects
          </h1>
          <p className="mt-3 text-stone-600 text-sm max-w-2xl mx-auto">
            From initial soil preparation to post-harvest market reconciliation, AgriBridge replaces fragmented WhatsApp groups and informal brokerages with a verifiable agricultural coordination engine.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="agri-card p-6 flex flex-col sm:flex-row items-start gap-5 hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#f0f7f2] text-[#24593c] shrink-0 font-bold text-base">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Step {step.num}
                    </span>
                    <h3 className="text-base font-bold text-stone-900">{step.title}</h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed mt-1">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#24593c] text-white font-medium text-sm hover:bg-[#1e4731] transition-colors shadow-sm"
          >
            <span>Start Your First Farm Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
