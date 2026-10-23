"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";
import {
  Sprout,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Languages,
  LogOut,
  User,
  ShieldCheck,
  Layers,
  Wrench,
  Truck,
  Users,
  Coins,
  ShoppingBag,
  Package,
  FileText,
  BookOpen,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { Badge } from "../ui/Badge";

export function Navbar() {
  const { user, switchRole, logout } = useAuth();
  const { locale, setLocale, t, locales } = useI18n();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketplacesOpen, setMarketplacesOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const marketplacesMenuRef = useRef<HTMLDivElement>(null);
  const roleSwitcherRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
      if (marketplacesMenuRef.current && !marketplacesMenuRef.current.contains(event.target as Node)) {
        setMarketplacesOpen(false);
      }
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardPath = (role?: string) => {
    const r = role || user?.activeRole || "FARMER";
    switch (r) {
      case "FARMER":
        return "/dashboard/farmer";
      case "LANDOWNER":
        return "/dashboard/landowner";
      case "INVESTOR":
        return "/dashboard/investor";
      case "WORKER":
        return "/dashboard/worker";
      case "BUYER":
        return "/dashboard/buyer";
      case "MACHINERY_OWNER":
        return "/dashboard/machinery";
      case "SUPPLIER":
        return "/dashboard/supplier";
      case "TRANSPORTER":
        return "/dashboard/transporter";
      case "ADMIN":
      case "SUPER_ADMIN":
        return "/dashboard/admin";
      default:
        return "/dashboard/farmer";
    }
  };

  const isSuperAdminOrAdmin =
    user?.roles?.includes("SUPER_ADMIN") || user?.roles?.includes("ADMIN");

  const navLinks = [
    { name: t.nav?.home || "Home", href: "/" },
    { name: t.nav?.projects || "Farm Projects", href: "/projects" },
    { name: t.nav?.gap_engine || "Resource Gap Engine", href: "/projects/matches" },
    { name: t.nav?.advisory || "Crop Advisory", href: "/intelligence/crop-advisory" },
    { name: "Government Schemes", href: "/schemes" },
    { name: "Knowledge Hub", href: "/knowledge" },
  ];

  const marketplaceLinks = [
    { name: t.marketplaces_menu?.labour || "Farm Labour & Gangs", href: "/marketplaces/labour", icon: Users },
    { name: t.marketplaces_menu?.machinery || "Machinery Rentals", href: "/marketplaces/machinery", icon: Wrench },
    { name: t.marketplaces_menu?.inputs || "Agri-Inputs & Seeds", href: "/marketplaces/inputs", icon: Package },
    { name: t.marketplaces_menu?.produce || "Produce & Buyers", href: "/marketplaces/produce", icon: ShoppingBag },
    { name: t.marketplaces_menu?.transport || "Transport & Logistics", href: "/marketplaces/transport", icon: Truck },
    { name: t.marketplaces_menu?.investment || "Agri-Investments", href: "/marketplaces/investment", icon: Coins },
    { name: t.marketplaces_menu?.land || "Agricultural Land", href: "/marketplaces/land", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 text-[#24593c] shrink-0">
              <div className="w-9 h-9 rounded-lg bg-[#24593c] flex items-center justify-center text-white shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-stone-900 leading-none">
                  AgriBridge
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-widest mt-0.5">
                  Tamil Nadu Ecosystem
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-[#f0f7f2] text-[#24593c]"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Marketplaces Dropdown */}
              <div className="relative" ref={marketplacesMenuRef}>
                <button
                  type="button"
                  onClick={() => setMarketplacesOpen(!marketplacesOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    pathname.startsWith("/marketplaces")
                      ? "bg-[#f0f7f2] text-[#24593c]"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  <span>{t.nav?.marketplaces || "Marketplaces"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {marketplacesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-xl bg-white shadow-xl border border-stone-200 py-2 z-50 animate-fadeIn">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
                      Agricultural Exchanges
                    </div>
                    {marketplaceLinks.map((m) => {
                      const Icon = m.icon;
                      return (
                        <Link
                          key={m.href}
                          href={m.href}
                          onClick={() => setMarketplacesOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-stone-700 hover:bg-emerald-50/60 hover:text-[#24593c] transition-colors"
                        >
                          <Icon className="w-4 h-4 text-stone-400" />
                          <span>{m.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Language Selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                type="button"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200 shadow-2xs"
                title="Change Platform Language"
              >
                <Languages className="w-3.5 h-3.5 text-[#24593c]" />
                <span>{locales.find((l) => l.code === locale)?.nativeName || "English"}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {languageDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    {t.common?.select_language || "Select Language"}
                  </div>
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => {
                        setLocale(loc.code);
                        setLanguageDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                        locale === loc.code
                          ? "bg-[#f0f7f2] text-[#24593c] font-bold"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{loc.flag}</span>
                        <span>{loc.nativeName}</span>
                      </div>
                      {locale === loc.code && (
                        <Check className="w-3.5 h-3.5 text-[#24593c]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SEPARATE ADMIN ENTRY - STRICTLY FOR AUTHORIZED SUPER ADMIN / ADMIN */}
            {isSuperAdminOrAdmin && (
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-stone-800 transition-all shadow-xs"
                title="Super Admin Platform Governance"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Console</span>
                {user?.roles?.includes("SUPER_ADMIN") && (
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1 py-0.5 rounded font-mono uppercase tracking-wider">
                    Owner
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                {/* Working Role Switcher for Multi-Role Users */}
                {user.roles && user.roles.length > 1 && (
                  <div className="relative" ref={roleSwitcherRef}>
                    <button
                      type="button"
                      onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#f0f7f2] text-[#24593c] border border-[#bbe0c7] hover:bg-[#e4f3e9] transition-colors"
                      title="Switch active stakeholder workspace"
                    >
                      <span className="uppercase">{user.activeRole}</span>
                      <ChevronDown className="w-3 h-3 text-[#24593c]" />
                    </button>

                    {roleSwitcherOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 z-50">
                        <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                          Switch Active Workspace
                        </div>
                        {user.roles.map((r) => {
                          const isCurrent = user.activeRole === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setRoleSwitcherOpen(false);
                                switchRole(r, `/dashboard/${r.toLowerCase()}`);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                                isCurrent
                                  ? "bg-[#f0f7f2] text-[#24593c] font-bold"
                                  : "text-stone-700 hover:bg-stone-50"
                              }`}
                            >
                              <span>{r}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-[#24593c]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile Drawer / Dropdown */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#24593c] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                      {user.fullName.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl bg-white shadow-xl border border-stone-200 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-stone-100">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {user.fullName}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-bold uppercase bg-emerald-100 text-[#1e4731] px-2 py-0.5 rounded">
                            {user.activeRole}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {user.district || "Tamil Nadu"}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href={getDashboardPath(user.activeRole)}
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-[#f0f7f2] hover:text-[#24593c]"
                        >
                          <span>Open Workspace Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href="/projects/new"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs text-stone-700 hover:bg-stone-50"
                        >
                          <span>Start New Farm Project</span>
                        </Link>
                        <Link
                          href="/agreements"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs text-stone-700 hover:bg-stone-50"
                        >
                          <span>Agreements &amp; Contracts</span>
                        </Link>
                        <Link
                          href="/notifications"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 text-xs text-stone-700 hover:bg-stone-50"
                        >
                          <span>Alerts &amp; Notifications</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t.nav?.logout || "Sign Out"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  {t.nav?.login || "Sign In"}
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-xs font-bold bg-[#24593c] text-white hover:bg-[#1a402a] rounded-lg transition-colors shadow-2xs"
                >
                  {t.nav?.register || "Register"}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center xl:hidden gap-2">
            {isSuperAdminOrAdmin && (
              <Link
                href="/dashboard/admin"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-stone-900 text-amber-300 text-[11px] font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setLocale(locale === "en" ? "ta" : "en")}
              className="px-2 py-1 text-xs font-bold text-[#24593c] bg-[#f0f7f2] rounded border border-[#bbe0c7]"
            >
              {locale === "en" ? "தமிழ்" : "EN"}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-fadeIn">
          {user ? (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="font-bold text-xs text-stone-900">{user.fullName}</div>
              <div className="text-[11px] text-stone-500">{user.email}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-[#1e4731] px-2 py-0.5 rounded">
                  {user.activeRole}
                </span>
                <Link
                  href={getDashboardPath(user.activeRole)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#24593c] underline"
                >
                  Go to Dashboard →
                </Link>
              </div>

              {user.roles && user.roles.length > 1 && (
                <div className="mt-3 pt-2 border-t border-stone-200">
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Switch Workspace:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          switchRole(r, `/dashboard/${r.toLowerCase()}`);
                        }}
                        className={`text-[10px] font-semibold px-2 py-1 rounded border ${
                          user.activeRole === r
                            ? "bg-[#24593c] text-white border-[#24593c]"
                            : "bg-white text-stone-700 border-stone-300"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-1 pb-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 py-2 text-center text-xs font-semibold text-stone-700 bg-stone-100 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 py-2 text-center text-xs font-bold bg-[#24593c] text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          )}

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "bg-[#f0f7f2] text-[#24593c]"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-3 mb-1">
              Marketplaces &amp; Services
            </div>
            <div className="grid grid-cols-2 gap-1">
              {marketplaceLinks.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-lg"
                  >
                    <Icon className="w-3.5 h-3.5 text-stone-400" />
                    <span>{m.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {user && (
            <div className="border-t border-stone-100 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
