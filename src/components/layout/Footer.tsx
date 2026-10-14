import React from "react";
import Link from "next/link";
import { Sprout, ShieldCheck, HeartHandshake, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <div className="w-8 h-8 rounded bg-emerald-800 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AgriBridge</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Unified agriculture collaboration and resource coordination platform connecting Indian farmers with capital, labour, machinery, certified inputs, buyers, and transport.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Profiles & Aadhaar/Patta KYC</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  Farm Project Workspace
                </Link>
              </li>
              <li>
                <Link href="/projects/matches" className="hover:text-white transition-colors">
                  Resource Gap Matching Engine
                </Link>
              </li>
              <li>
                <Link href="/marketplaces/labour" className="hover:text-white transition-colors">
                  Agricultural Labour Gangs
                </Link>
              </li>
              <li>
                <Link href="/marketplaces/machinery" className="hover:text-white transition-colors">
                  Tractor & Drone Rentals
                </Link>
              </li>
              <li>
                <Link href="/marketplaces/produce" className="hover:text-white transition-colors">
                  Produce & Mandi Buyers
                </Link>
              </li>
              <li>
                <Link href="/marketplaces/investment" className="hover:text-white transition-colors">
                  Co-Farming & Investment
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Focus */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Regional Coverage
            </h4>
            <div className="flex items-start gap-2 text-xs text-stone-400 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Cauvery Delta & Tamil Nadu Farming Clusters</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-400">
              <span className="bg-stone-800 px-2 py-0.5 rounded">Thanjavur</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Thiruvarur</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Nagapattinam</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Tiruchirappalli</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Madurai</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Coimbatore</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Salem</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded">Erode</span>
            </div>
          </div>

          {/* Trust, Governance & Legal */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
              Trust & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How AgriBridge Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Agricultural Services Overview
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About AgriBridge Mission
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Agreement
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy & Data Governance
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Support & Grievances
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 AgriBridge Technology Platform. Non-negotiable transparent agriculture.</p>
          <p className="flex items-center gap-1">
            <span>Built for Indian Agriculture • Real Persistence & Zero Fake Records</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
