"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { Badge } from "../ui/Badge";

export function Navbar() {
  const { user, switchRole, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketplacesOpen, setMarketplacesOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const getDashboardPath = (role: string) => {
    switch (role) {
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
        return "/dashboard/admin";
      default:
        return "/dashboard/farmer";
    }
  };

  const navLinks = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.projects, href: "/projects" },
    { name: t.nav.gap_engine, href: "/projects/matches" },
    { name: t.nav.advisory, href: "/intelligence/crop-advisory" },
  ];

  const marketplaceLinks = [
    { name: "Farm Labour", href: "/marketplaces/labour", icon: Users },
    { name: "Machinery Rentals", href: "/marketplaces/machinery", icon: Wrench },
    { name: "Agri-Inputs & Seeds", href: "/marketplaces/inputs", icon: Package },
    { name: "Produce & Buyers", href: "/marketplaces/produce", icon: ShoppingBag },
    { name: "Transport & Logistics", href: "/marketplaces/transport", icon: Truck },
    { name: "Agri-Investments", href: "/marketplaces/investment", icon: Coins },
    { name: "Agricultural Land", href: "/marketplaces/land", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 text-[#24593c]">
              <div className="w-9 h-9 rounded-md bg-[#24593c] flex items-center justify-center text-white shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-stone-900 leading-none">
                  AgriBridge
                </span>
                <span className="text-[10px] font-medium text-stone-500 uppercase tracking-widest mt-0.5">
                  Tamil Nadu Ecosystem
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-stone-100 text-[#24593c] font-semibold"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Marketplaces Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMarketplacesOpen(!marketplacesOpen)}
                  onBlur={() => setTimeout(() => setMarketplacesOpen(false), 200)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                >
                  <span>{t.nav.marketplaces}</span>
                  <ChevronDown className="w-4 h-4 text-stone-400" />
                </button>

                {marketplacesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-60 rounded-md bg-white shadow-lg border border-stone-200 py-1.5 z-50 animate-fadeIn">
                    {marketplaceLinks.map((m) => {
                      const Icon = m.icon;
                      return (
                        <Link
                          key={m.href}
                          href={m.href}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-[#24593c]"
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
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLocale(locale === "en" ? "ta" : "en")}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors border border-stone-200"
              title="Toggle Tamil / English"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{locale === "en" ? "தமிழ்" : "English"}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Multi-role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                    onBlur={() => setTimeout(() => setRoleSwitcherOpen(false), 200)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-[#f0f7f2] text-[#24593c] border border-[#bbe0c7] hover:bg-[#dcf0e2] transition-colors"
                  >
                    <span className="font-semibold uppercase">{user.activeRole}</span>
                    {user.roles.length > 1 && (
                      <ChevronDown className="w-3.5 h-3.5 text-[#24593c]" />
                    )}
                  </button>

                  {roleSwitcherOpen && user.roles.length > 1 && (
                    <div className="absolute right-0 top-full mt-1 w-48 rounded-md bg-white shadow-lg border border-stone-200 py-1 z-50">
                      <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                        Switch Active Role
                      </div>
                      {user.roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => switchRole(r)}
                          className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between ${
                            user.activeRole === r
                              ? "bg-[#f0f7f2] text-[#24593c] font-semibold"
                              : "text-stone-700 hover:bg-stone-50"
                          }`}
                        >
                          <span>{r}</span>
                          {user.activeRole === r && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#24593c]"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dashboard Link */}
                <Link
                  href={getDashboardPath(user.activeRole)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-[#24593c] text-white hover:bg-[#1e4731] transition-colors shadow-2xs"
                >
                  {t.nav.dashboard}
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-md transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-sm font-medium bg-[#24593c] text-white hover:bg-[#1e4731] rounded-md transition-colors shadow-2xs"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setLocale(locale === "en" ? "ta" : "en")}
              className="px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded border border-stone-200"
            >
              {locale === "en" ? "தமிழ்" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-stone-50"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <p className="px-3 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
              Marketplaces
            </p>
            <div className="grid grid-cols-2 gap-1">
              {marketplaceLinks.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 rounded-md"
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-3 py-1 text-sm text-stone-600">
                  <span>Logged in as: <strong>{user.fullName}</strong></span>
                  <Badge variant="verified">{user.activeRole}</Badge>
                </div>
                <Link
                  href={getDashboardPath(user.activeRole)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-sm"
                >
                  Go to {user.activeRole} Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-center px-4 py-2 rounded-md border border-stone-300 text-stone-700 font-medium text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-md border border-stone-300 text-stone-700 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 rounded-md bg-[#24593c] text-white font-medium text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
