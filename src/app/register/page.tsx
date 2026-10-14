"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sprout, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const AVAILABLE_ROLES = [
  { id: "FARMER", label: "Farmer / Cultivator" },
  { id: "LANDOWNER", label: "Agricultural Landowner" },
  { id: "INVESTOR", label: "Agri-Investor / Partner" },
  { id: "WORKER", label: "Farm Worker / Crew Leader" },
  { id: "BUYER", label: "Produce Buyer / Mandi Trader" },
  { id: "MACHINERY_OWNER", label: "Machinery / Equipment Owner" },
  { id: "SUPPLIER", label: "Agri-Input & Seed Supplier" },
  { id: "TRANSPORTER", label: "Logistics & Transport Provider" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    district: "Thanjavur",
    state: "Tamil Nadu",
    roles: ["FARMER"] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleRole = (roleId: string) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(roleId);
      if (exists) {
        if (prev.roles.length === 1) return prev; // Keep at least one
        return { ...prev, roles: prev.roles.filter((r) => r !== roleId) };
      } else {
        return { ...prev, roles: [...prev.roles, roleId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      await refreshUser();
      const primaryRole = formData.roles[0] || "FARMER";
      router.push(`/dashboard/${primaryRole.toLowerCase()}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-20 flex items-center justify-center px-4 bg-[#fbfbfa]">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#24593c] text-white mb-3 shadow-xs">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Join AgriBridge</h1>
          <p className="text-xs text-stone-500 mt-1">
            Create a unified account. Select all the roles that apply to you.
          </p>
        </div>

        <div className="agri-card p-6 bg-white">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                placeholder="e.g. Murugan Selvam"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                  placeholder="+91 98400 00000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                >
                  <option value="Thanjavur">Thanjavur</option>
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
                  Password (min 8 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Multi-role selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Select Your Roles on AgriBridge (Check all that apply)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-stone-50 rounded-md border border-stone-200">
                {AVAILABLE_ROLES.map((r) => {
                  const checked = formData.roles.includes(r.id);
                  return (
                    <label
                      key={r.id}
                      className={`flex items-center gap-2 p-2 rounded text-xs cursor-pointer border transition-colors ${
                        checked
                          ? "bg-white border-[#24593c] text-[#24593c] font-semibold shadow-2xs"
                          : "border-transparent text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(r.id)}
                        className="rounded text-[#24593c] focus:ring-[#24593c]"
                      />
                      <span>{r.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Complete Registration
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-[#24593c] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
