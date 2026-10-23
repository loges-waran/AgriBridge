"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Sprout,
  ShoppingBag,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Settings,
  Bot,
  Layers,
  Coins,
  ShieldCheck,
  UserCheck,
  UserX,
  Search,
  Filter,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface AdminConsoleProps {
  currentUser: {
    id: string;
    fullName: string;
    email: string;
    activeRole: string;
    roles: string[];
    isSuperAdmin: boolean;
  };
  initialData: {
    totalUsers: number;
    totalProjects: number;
    totalListings: number;
    totalTxns: number;
    users: any[];
    landRecords: any[];
    suppliers: any[];
    produceListings: any[];
    complaints: any[];
    financialTxns: any[];
    agreements: any[];
    aiLogs: any[];
    settings: any[];
    auditLogs: any[];
  };
}

export function AdminConsoleClient({ currentUser, initialData }: AdminConsoleProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "marketplace" | "ai" | "staff" | "settings" | "audit"
  >("overview");

  // State for dynamic items
  const [users, setUsers] = useState<any[]>(initialData.users);
  const [landRecords, setLandRecords] = useState<any[]>(initialData.landRecords);
  const [suppliers, setSuppliers] = useState<any[]>(initialData.suppliers);
  const [produceListings, setProduceListings] = useState<any[]>(initialData.produceListings);
  const [complaints, setComplaints] = useState<any[]>(initialData.complaints);
  const [settings, setSettings] = useState<any[]>(initialData.settings);
  const [auditLogs, setAuditLogs] = useState<any[]>(initialData.auditLogs);

  // User search/filter
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Staff management state
  const [staffEmail, setStaffEmail] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Settings edit state
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setActionMsg({ text, type });
    setTimeout(() => setActionMsg(null), 4000);
  };

  // User moderation handler
  const handleUserAction = async (targetUserId: string, action: "SUSPEND" | "RESTORE") => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} this account?`
    );
    if (!confirmAction) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetUserId, reason: "Administrative governance review" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, isActive: action === "RESTORE" } : u))
      );
      showFeedback(data.message);
    } catch (err: any) {
      showFeedback(err.message, "error");
    }
  };

  // Land verification handler
  const handleVerifyLand = async (id: string, verify: boolean) => {
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_LAND", targetId: id, verify }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setLandRecords((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isVerified: verify } : l))
      );
      showFeedback(verify ? "Land Patta record verified!" : "Land Patta verification revoked.");
    } catch (err: any) {
      showFeedback(err.message, "error");
    }
  };

  // Supplier verification handler
  const handleVerifySupplier = async (id: string, verify: boolean) => {
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_SUPPLIER", targetId: id, verify }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isVerified: verify } : s))
      );
      showFeedback(verify ? "Supplier business verified!" : "Supplier verification revoked.");
    } catch (err: any) {
      showFeedback(err.message, "error");
    }
  };

  // Produce listing status handler
  const handleModerateProduce = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MODERATE_PRODUCE", targetId: id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Moderation failed");

      setProduceListings((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      showFeedback(`Produce listing set to ${newStatus}.`);
    } catch (err: any) {
      showFeedback(err.message, "error");
    }
  };

  // Staff admin grant/revoke
  const handleStaffRole = async (targetEmail: string, action: "GRANT" | "REVOKE") => {
    if (!currentUser.isSuperAdmin) {
      showFeedback("Only the Super Admin (Project Owner) can manage staff roles", "error");
      return;
    }
    const confirm = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} administrator privileges for ${targetEmail}?`
    );
    if (!confirm) return;

    setStaffLoading(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Staff update failed");

      showFeedback(data.message);
      setStaffEmail("");
      // Update local users
      setUsers((prev) =>
        prev.map((u) => {
          if (u.email.toLowerCase() === targetEmail.toLowerCase()) {
            const hasAdmin = u.roles.some((r: any) => r.role === "ADMIN");
            if (action === "GRANT" && !hasAdmin) {
              return { ...u, roles: [...u.roles, { role: "ADMIN", isDefault: false }] };
            }
            if (action === "REVOKE") {
              return { ...u, roles: u.roles.filter((r: any) => r.role !== "ADMIN") };
            }
          }
          return u;
        })
      );
    } catch (err: any) {
      showFeedback(err.message, "error");
    } finally {
      setStaffLoading(false);
    }
  };

  // Settings update
  const handleSaveSetting = async (key: string, value: string) => {
    setSavingKey(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setting update failed");

      setSettings((prev) =>
        prev.map((s) => (s.key === key ? { ...s, value } : s))
      );
      showFeedback(`Setting '${key}' saved.`);
    } catch (err: any) {
      showFeedback(err.message, "error");
    } finally {
      setSavingKey(null);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.district && u.district.toLowerCase().includes(userSearch.toLowerCase()));
    const matchesRole = roleFilter
      ? u.roles.some((r: any) => r.role === roleFilter)
      : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-stone-900">
                AgriBridge Executive Governance Center
              </h1>
              {currentUser.isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  Super Admin (Owner)
                </span>
              ) : (
                <Badge variant="verified">Staff Administrator</Badge>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Platform Administration • Multi-Role Governance • Marketplace Oversight & AI Auditing
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/verifications"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#24593c] text-white font-medium text-xs hover:bg-[#1e4731] shadow-2xs"
            >
              <span>KYC Verification Queue</span>
            </Link>
            <Link
              href="/admin/disputes"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-stone-300 bg-white text-stone-700 font-medium text-xs hover:bg-stone-50 shadow-2xs"
            >
              <span>Dispute Mediation</span>
            </Link>
          </div>
        </div>

        {/* Global Action Feedback Alert */}
        {actionMsg && (
          <div
            className={`my-4 p-3 rounded-md border text-xs font-semibold flex items-center justify-between ${
              actionMsg.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-red-50 border-red-300 text-red-800"
            }`}
          >
            <span>{actionMsg.text}</span>
            <button onClick={() => setActionMsg(null)} className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 py-4 border-b border-stone-200 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "bg-[#24593c] text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Platform Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "users"
                ? "bg-[#24593c] text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({users.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "marketplace"
                ? "bg-[#24593c] text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Marketplace & Land ({landRecords.length + suppliers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "ai"
                ? "bg-[#24593c] text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AgriVoice AI Governance ({initialData.aiLogs.length})</span>
          </button>
          {currentUser.isSuperAdmin && (
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === "staff"
                  ? "bg-[#24593c] text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Staff Admins</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-[#24593c] text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Platform Settings</span>
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "bg-[#24593c] text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Registered Users" value={initialData.totalUsers} subtext="9 Ecosystem Personas" icon={Users} />
              <StatCard label="Active Farm Projects" value={initialData.totalProjects} subtext="Across Tamil Nadu" icon={Sprout} />
              <StatCard label="Produce & Inputs Listed" value={initialData.totalListings} subtext="Active Marketplace Items" icon={ShoppingBag} />
              <StatCard label="Financial Transactions" value={initialData.totalTxns} subtext="Reconciled Ledger Txns" icon={Coins} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Financial Transactions */}
              <div className="agri-card p-5 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <h3 className="text-sm font-bold text-stone-900">Recent Financial Transactions</h3>
                  <Badge variant="verified">Escrow & Reconciliation</Badge>
                </div>
                {initialData.financialTxns.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">No transactions recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {initialData.financialTxns.slice(0, 5).map((txn: any) => (
                      <div key={txn.id} className="p-2.5 rounded bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-stone-800">{txn.description}</div>
                          <div className="text-[11px] text-stone-400">
                            {new Date(txn.createdAt).toLocaleDateString()} • {txn.paymentMode}
                          </div>
                        </div>
                        <span className={`font-mono font-bold ${txn.transactionType === "CREDIT" ? "text-emerald-700" : "text-stone-700"}`}>
                          {txn.transactionType === "CREDIT" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bilateral Agreements */}
              <div className="agri-card p-5 bg-white">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                  <h3 className="text-sm font-bold text-stone-900">Active Bilateral Agreements</h3>
                  <Badge variant="verified">Legally Grounded</Badge>
                </div>
                {initialData.agreements.length === 0 ? (
                  <p className="text-xs text-stone-500 py-4 text-center">No agreements recorded yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {initialData.agreements.slice(0, 5).map((agr: any) => (
                      <div key={agr.id} className="p-2.5 rounded bg-stone-50 border border-stone-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-semibold text-stone-800">{agr.title}</div>
                          <div className="text-[11px] text-stone-400">
                            Type: {agr.type} • Partner: {agr.partner?.fullName}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {agr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="py-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by name, email, or district..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-stone-300 rounded-md bg-white text-stone-700"
                >
                  <option value="">All Roles</option>
                  <option value="FARMER">Farmer</option>
                  <option value="LANDOWNER">Landowner</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="WORKER">Worker</option>
                  <option value="BUYER">Buyer</option>
                  <option value="MACHINERY_OWNER">Machinery Owner</option>
                  <option value="SUPPLIER">Supplier</option>
                  <option value="TRANSPORTER">Transporter</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                <span className="text-xs text-stone-500 whitespace-nowrap">
                  Showing {filteredUsers.length} of {users.length}
                </span>
              </div>
            </div>

            <div className="agri-card overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-4 py-3">User & Email</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Assigned Roles</th>
                      <th className="px-4 py-3">Email Verified</th>
                      <th className="px-4 py-3">Account Status</th>
                      <th className="px-4 py-3 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredUsers.map((u) => {
                      const isSuper = u.roles.some((r: any) => r.role === "SUPER_ADMIN");
                      return (
                        <tr key={u.id} className="hover:bg-stone-50/50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-stone-900">{u.fullName}</div>
                            <div className="text-[11px] text-stone-500">{u.email}</div>
                          </td>
                          <td className="px-4 py-3 text-stone-600">{u.district || "Tamil Nadu"}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {u.roles.map((r: any) => (
                                <span
                                  key={r.role}
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                    r.role === "SUPER_ADMIN"
                                      ? "bg-amber-100 text-amber-900"
                                      : r.role === "ADMIN"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-emerald-50 text-[#24593c] border border-emerald-200"
                                  }`}
                                >
                                  {r.role}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {u.isEmailVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                                <Check className="w-3.5 h-3.5" /> Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                                <X className="w-3.5 h-3.5" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {u.isActive ? (
                              <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 font-bold">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] rounded-full bg-red-100 text-red-800 font-bold">
                                Suspended
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isSuper ? (
                              <span className="text-[11px] text-stone-400 font-bold">Protected Owner</span>
                            ) : (
                              <div className="inline-flex items-center gap-2">
                                {u.isActive ? (
                                  <button
                                    onClick={() => handleUserAction(u.id, "SUSPEND")}
                                    className="px-2 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                                  >
                                    Suspend
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUserAction(u.id, "RESTORE")}
                                    className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                                  >
                                    Restore
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MARKETPLACE & LAND VERIFICATION */}
        {activeTab === "marketplace" && (
          <div className="py-6 space-y-6">
            {/* Land Patta Verification */}
            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Land Records & Patta / Chitta Revenue Verifications</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Verify authentic agricultural land ownership records</p>
                </div>
                <Badge variant="verified">{landRecords.length} Parcels Listed</Badge>
              </div>

              <div className="space-y-3">
                {landRecords.map((land) => (
                  <div key={land.id} className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-stone-900">
                        Patta No: {land.titleNumber} • {land.acresAvailable} Acres Available
                      </div>
                      <div className="text-stone-500 mt-0.5">
                        Owner: {land.owner?.fullName} ({land.owner?.email}) • Lease Type: {land.leaseType} • Soil pH: {land.soilPh || "Neutral"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {land.isVerified ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Patta Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending Verification
                        </span>
                      )}

                      <button
                        onClick={() => handleVerifyLand(land.id, !land.isVerified)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                          land.isVerified
                            ? "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                            : "border-[#24593c] bg-[#24593c] text-white hover:bg-[#1a402a]"
                        }`}
                      >
                        {land.isVerified ? "Revoke Verification" : "Approve & Verify Patta"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier Profiles */}
            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Agri-Input Suppliers & Seed Distribution Hubs</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Approve certified fertilizer and seed vendor profiles</p>
                </div>
                <Badge variant="verified">{suppliers.length} Registered Hubs</Badge>
              </div>

              <div className="space-y-3">
                {suppliers.map((sup) => (
                  <div key={sup.id} className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-stone-900">
                        {sup.businessName} • District: {sup.district}
                      </div>
                      <div className="text-stone-500 mt-0.5">
                        License: {sup.licenseNumber || "State Fertilizer Dealer License"} • Operator: {sup.user?.fullName}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {sup.isVerified ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                          ✓ Licensed Dealer
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                          Pending Audit
                        </span>
                      )}

                      <button
                        onClick={() => handleVerifySupplier(sup.id, !sup.isVerified)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                          sup.isVerified
                            ? "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                            : "border-[#24593c] bg-[#24593c] text-white hover:bg-[#1a402a]"
                        }`}
                      >
                        {sup.isVerified ? "Revoke Status" : "Verify Supplier Hub"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Produce Listings Moderation */}
            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <h3 className="text-sm font-bold text-stone-900">Produce Marketplace Listings Moderation</h3>
                <Badge variant="verified">{produceListings.length} Active Listings</Badge>
              </div>

              <div className="space-y-3">
                {produceListings.map((prod) => (
                  <div key={prod.id} className="p-3 rounded-lg border border-stone-200 bg-stone-50/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">
                        {prod.cropName} ({prod.variety || "Organic"}) • {prod.quantityKg} kg @ ₹{prod.askingPricePerKg}/kg
                      </div>
                      <div className="text-stone-500 mt-0.5">
                        Farmer: {prod.farmer?.fullName} • District: {prod.locationDistrict} • Grade: {prod.grade}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prod.status === "BANNED" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {prod.status}
                      </span>
                      {prod.status === "BANNED" ? (
                        <button
                          onClick={() => handleModerateProduce(prod.id, "AVAILABLE")}
                          className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded"
                        >
                          Approve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleModerateProduce(prod.id, "BANNED")}
                          className="px-2 py-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded"
                        >
                          Suspend Listing
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AGRIVOICE AI GOVERNANCE */}
        {activeTab === "ai" && (
          <div className="py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="agri-card p-4 bg-white border-l-4 border-l-emerald-600">
                <div className="text-xs text-stone-500 font-semibold uppercase">Total Queries Logged</div>
                <div className="text-2xl font-bold text-stone-900 mt-1">{initialData.aiLogs.length}</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Tamil & English Speech/Text</div>
              </div>

              <div className="agri-card p-4 bg-white border-l-4 border-l-blue-600">
                <div className="text-xs text-stone-500 font-semibold uppercase">Est. Token Consumption</div>
                <div className="text-2xl font-bold text-stone-900 mt-1">
                  {initialData.aiLogs.reduce((acc, log) => acc + (log.tokensUsed || 0), 0).toLocaleString()}
                </div>
                <div className="text-[11px] text-blue-700 mt-0.5">Gemini 3.1 & Knowledge Base</div>
              </div>

              <div className="agri-card p-4 bg-white border-l-4 border-l-amber-600">
                <div className="text-xs text-stone-500 font-semibold uppercase">Safety Guardrail Flags</div>
                <div className="text-2xl font-bold text-stone-900 mt-1">
                  {initialData.aiLogs.filter((l) => !l.isSafe).length}
                </div>
                <div className="text-[11px] text-amber-700 mt-0.5">Non-Agri Refusal Activations</div>
              </div>
            </div>

            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">AgriVoice AI Real-Time Audit Log</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Inspect user prompts, domain topics, provider attribution, and safety flags</p>
                </div>
                <Badge variant="verified">Safe TNAU Agronomic Guidance</Badge>
              </div>

              {initialData.aiLogs.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6">No queries logged yet in this session.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="px-3 py-2.5">Prompt Extract</th>
                        <th className="px-3 py-2.5">Topic</th>
                        <th className="px-3 py-2.5">Provider</th>
                        <th className="px-3 py-2.5">Language</th>
                        <th className="px-3 py-2.5">Safety & Policy</th>
                        <th className="px-3 py-2.5 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {initialData.aiLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-stone-50/50">
                          <td className="px-3 py-2.5 font-medium text-stone-900 max-w-xs truncate" title={log.prompt}>
                            {log.prompt}
                          </td>
                          <td className="px-3 py-2.5 text-stone-700">{log.topic}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px] uppercase text-stone-500">{log.provider}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px] uppercase text-stone-500">{log.locale}</td>
                          <td className="px-3 py-2.5">
                            {log.isSafe ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                Approved Agronomic
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded" title={log.flagReason}>
                                Refused (Non-Agri)
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-right text-stone-400 text-[11px]">
                            {new Date(log.createdAt).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: STAFF ADMINISTRATORS (SUPER ADMIN ONLY) */}
        {activeTab === "staff" && currentUser.isSuperAdmin && (
          <div className="py-6 space-y-6">
            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Authorize Staff Administrators</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Only you (the Project Owner) can grant or revoke elevated administrative privileges.
                  </p>
                </div>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-full border border-amber-300">
                  Super Admin Exclusive
                </span>
              </div>

              {/* Grant Admin Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (staffEmail) handleStaffRole(staffEmail, "GRANT");
                }}
                className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-stone-50 rounded-lg border border-stone-200 mb-6"
              >
                <div className="w-full">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Registered User Email to Elevate
                  </label>
                  <input
                    type="email"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    placeholder="staff.officer@agribridge.org"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c]"
                  />
                </div>
                <Button type="submit" loading={staffLoading} className="w-full sm:w-auto mt-auto whitespace-nowrap">
                  Grant Staff Admin Role
                </Button>
              </form>

              {/* Current Staff List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Active System Administrators
                </h4>
                {users
                  .filter((u) => u.roles.some((r: any) => r.role === "ADMIN" || r.role === "SUPER_ADMIN"))
                  .map((admin) => {
                    const isRoot = admin.roles.some((r: any) => r.role === "SUPER_ADMIN");
                    return (
                      <div
                        key={admin.id}
                        className="p-3 rounded-lg border border-stone-200 bg-white flex items-center justify-between text-xs shadow-2xs"
                      >
                        <div>
                          <div className="font-bold text-stone-900 flex items-center gap-2">
                            <span>{admin.fullName}</span>
                            {isRoot ? (
                              <span className="px-2 py-0.5 text-[10px] bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold">
                                Project Owner
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] bg-red-100 text-red-800 rounded font-bold">
                                Staff Admin
                              </span>
                            )}
                          </div>
                          <div className="text-stone-500 mt-0.5">{admin.email}</div>
                        </div>

                        <div>
                          {isRoot ? (
                            <span className="text-[11px] font-semibold text-stone-400">Irrevocable Root Access</span>
                          ) : (
                            <button
                              onClick={() => handleStaffRole(admin.email, "REVOKE")}
                              className="px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                            >
                              Revoke Admin
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PLATFORM SETTINGS */}
        {activeTab === "settings" && (
          <div className="py-6 space-y-4">
            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Platform Operational Settings</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Control system toggles, AI token limits, and compliance behavior</p>
                </div>
                <Badge variant="verified">Live Configuration</Badge>
              </div>

              <div className="space-y-4">
                {settings.map((s) => (
                  <div key={s.key} className="p-3.5 rounded-lg border border-stone-200 bg-stone-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-mono font-bold text-stone-900">{s.key}</div>
                      <div className="text-stone-500 mt-0.5">{s.description || "Operational configuration"}</div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        defaultValue={s.value}
                        id={`input-${s.key}`}
                        className="px-3 py-1.5 border border-stone-300 rounded text-xs font-mono bg-white w-full sm:w-60 focus:ring-1 focus:ring-[#24593c]"
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`input-${s.key}`) as HTMLInputElement;
                          if (input) handleSaveSetting(s.key, input.value);
                        }}
                        disabled={savingKey === s.key}
                        className="px-3 py-1.5 bg-[#24593c] text-white rounded text-xs font-semibold hover:bg-[#1c452e] shrink-0"
                      >
                        {savingKey === s.key ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY AUDIT LEDGER */}
        {activeTab === "audit" && (
          <div className="py-6 space-y-4">
            <div className="agri-card p-5 bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Security Audit Trail & Governance Log</h3>
                  <p className="text-[11px] text-stone-500 mt-0.5">Immutable audit trail of administrator and system actions</p>
                </div>
                <Badge variant="verified">ACID Compliance Ledger</Badge>
              </div>

              {auditLogs.length === 0 ? (
                <p className="text-xs text-stone-500 py-6 text-center">No audit records logged yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="px-3 py-2.5">Action</th>
                        <th className="px-3 py-2.5">Target Type & ID</th>
                        <th className="px-3 py-2.5">Details</th>
                        <th className="px-3 py-2.5">Admin</th>
                        <th className="px-3 py-2.5 text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {auditLogs.map((log: any) => (
                        <tr key={log.id} className="hover:bg-stone-50/50">
                          <td className="px-3 py-2.5">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-stone-700">
                            <span className="font-semibold">{log.targetType}</span>
                            <span className="text-stone-400 text-[10px] block font-mono">{log.targetId}</span>
                          </td>
                          <td className="px-3 py-2.5 text-stone-600 max-w-sm truncate" title={log.details}>
                            {log.details || "—"}
                          </td>
                          <td className="px-3 py-2.5 text-stone-700">
                            {log.admin?.fullName?.split("[")[0] || log.adminId}
                          </td>
                          <td className="px-3 py-2.5 text-right text-stone-400 text-[11px]">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminConsoleClient;
