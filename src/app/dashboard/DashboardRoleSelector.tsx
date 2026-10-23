"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Sprout,
  Layers,
  Coins,
  Users,
  ShoppingBag,
  Wrench,
  Package,
  Truck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RoleMetadata {
  id: string;
  name: string;
  desc: string;
  icon: any;
  color: string;
}

const ALL_ROLES_INFO: Record<string, RoleMetadata> = {
  FARMER: {
    id: "FARMER",
    name: "Farmer / Cultivator",
    desc: "Manage crop cultivation cycles, farm projects, missing resource gaps, and produce sales.",
    icon: Sprout,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  LANDOWNER: {
    id: "LANDOWNER",
    name: "Agricultural Landowner",
    desc: "Register farmland parcels, manage Patta records, and establish lease or sharecropping contracts.",
    icon: Layers,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  INVESTOR: {
    id: "INVESTOR",
    name: "Agri-Investor / Partner",
    desc: "Discover vetted farm proposals, disburse co-farming capital, and track profit-sharing returns.",
    icon: Coins,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  WORKER: {
    id: "WORKER",
    name: "Farm Worker / Crew Leader",
    desc: "Manage crew skills, browse agricultural labour jobs, accept hiring offers, and log working days.",
    icon: Users,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  BUYER: {
    id: "BUYER",
    name: "Produce Buyer / Mandi Trader",
    desc: "Browse farm harvest listings, place forward pre-harvest bids, and execute purchase contracts.",
    icon: ShoppingBag,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  MACHINERY_OWNER: {
    id: "MACHINERY_OWNER",
    name: "Machinery / Equipment Owner",
    desc: "List tractors, harvesters, and drone sprayers for rent, assign operators, and track schedules.",
    icon: Wrench,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  SUPPLIER: {
    id: "SUPPLIER",
    name: "Agri-Input & Seed Supplier",
    desc: "Catalog certified seeds, bio-fertilizers, and crop protection inputs for doorstep farm delivery.",
    icon: Package,
    color: "bg-lime-50 text-lime-700 border-lime-200",
  },
  TRANSPORTER: {
    id: "TRANSPORTER",
    name: "Logistics & Transport Provider",
    desc: "Manage farm freight vehicles, accept haulage dispatches, and upload Proof of Delivery (POD).",
    icon: Truck,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  ADMIN: {
    id: "ADMIN",
    name: "Platform Governance & Admin",
    desc: "Oversee KYC verification queues, resolve participant disputes, and inspect the platform audit ledger.",
    icon: ShieldCheck,
    color: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function DashboardRoleSelector({
  user,
}: {
  user: {
    id: string;
    fullName: string;
    email: string;
    activeRole: string;
    roles: string[];
  };
}) {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSelectRole = async (role: string) => {
    setSwitching(role);
    try {
      await switchRole(role, `/dashboard/${role.toLowerCase()}`);
    } catch {
      window.location.href = `/dashboard/${role.toLowerCase()}`;
    }
  };

  return (
    <div className="py-10 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <Badge variant="verified">Unified Multi-Role Account</Badge>
          <h1 className="text-2xl font-bold text-stone-900 mt-2">
            Select Your Active Workspace
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-lg mx-auto">
            Welcome back, <span className="font-semibold text-stone-800">{user.fullName}</span>.
            Your account is authorized for multiple agricultural stakeholder roles. Choose the
            workspace you want to manage today:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.roles.map((roleId) => {
            const roleInfo = ALL_ROLES_INFO[roleId] || {
              id: roleId,
              name: roleId,
              desc: "Agricultural workspace access",
              icon: Sprout,
              color: "bg-stone-50 text-stone-700 border-stone-200",
            };
            const Icon = roleInfo.icon;
            const isActive = user.activeRole === roleId;
            const isSwitchingThis = switching === roleId;

            return (
              <div
                key={roleId}
                className={`agri-card p-5 transition-all bg-white flex flex-col justify-between border-2 ${
                  isActive ? "border-[#24593c] shadow-xs" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border ${roleInfo.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 leading-tight">
                          {roleInfo.name}
                        </h3>
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">
                          Permitted Role
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#24593c] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Current Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mb-4">{roleInfo.desc}</p>
                </div>

                <Button
                  onClick={() => handleSelectRole(roleId)}
                  loading={isSwitchingThis}
                  variant={isActive ? "primary" : "secondary"}
                  className="w-full justify-center"
                >
                  <span>Enter {roleInfo.name.split("/")[0].trim()} Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
