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
} from "lucide-react";

export function QuickDemoLogin() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const demoRoles = [
    {
      role: "FARMER",
      label: "Farmer",
      email: "farmer@agribridge.org",
      icon: Sprout,
      color: "hover:border-emerald-600 hover:text-emerald-800",
      path: "/dashboard/farmer",
    },
    {
      role: "LANDOWNER",
      label: "Landowner",
      email: "landowner@agribridge.org",
      icon: Layers,
      color: "hover:border-stone-600 hover:text-stone-800",
      path: "/dashboard/landowner",
    },
    {
      role: "INVESTOR",
      label: "Investor",
      email: "investor@agribridge.org",
      icon: Coins,
      color: "hover:border-amber-600 hover:text-amber-800",
      path: "/dashboard/investor",
    },
    {
      role: "WORKER",
      label: "Worker",
      email: "worker@agribridge.org",
      icon: Users,
      color: "hover:border-blue-600 hover:text-blue-800",
      path: "/dashboard/worker",
    },
    {
      role: "BUYER",
      label: "Produce Buyer",
      email: "buyer@agribridge.org",
      icon: ShoppingBag,
      color: "hover:border-green-600 hover:text-green-800",
      path: "/dashboard/buyer",
    },
    {
      role: "MACHINERY_OWNER",
      label: "Machinery Owner",
      email: "machinery@agribridge.org",
      icon: Wrench,
      color: "hover:border-cyan-600 hover:text-cyan-800",
      path: "/dashboard/machinery",
    },
    {
      role: "SUPPLIER",
      label: "Input Supplier",
      email: "supplier@agribridge.org",
      icon: Package,
      color: "hover:border-teal-600 hover:text-teal-800",
      path: "/dashboard/supplier",
    },
    {
      role: "TRANSPORTER",
      label: "Transporter",
      email: "transporter@agribridge.org",
      icon: Truck,
      color: "hover:border-purple-600 hover:text-purple-800",
      path: "/dashboard/transporter",
    },
    {
      role: "ADMIN",
      label: "Admin",
      email: "admin@agribridge.org",
      icon: ShieldCheck,
      color: "hover:border-red-600 hover:text-red-800",
      path: "/dashboard/admin",
    },
  ];

  const handleLogin = async (email: string, targetPath: string, roleName: string) => {
    setLoadingRole(roleName);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "AgriBridge2026!" }),
      });

      if (res.ok) {
        await refreshUser();
        router.push(targetPath);
      } else {
        alert("Demo login failed. Please ensure seed script has run.");
      }
    } catch (e) {
      console.error("Demo login error:", e);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {demoRoles.map((item) => {
        const Icon = item.icon;
        const isLoading = loadingRole === item.role;
        return (
          <button
            key={item.role}
            onClick={() => handleLogin(item.email, item.path, item.role)}
            disabled={loadingRole !== null}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border border-stone-200 bg-stone-50 text-stone-700 transition-all ${item.color} disabled:opacity-50`}
          >
            <Icon className="w-3.5 h-3.5 text-stone-500" />
            <span>{isLoading ? "Logging in..." : item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
