"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  district: string | null;
  state: string | null;
  kycStatus: string;
  activeRole: string;
  roles: string[];
  preferredLocale: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  switchRole: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const switchRole = async (role: string) => {
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        await refreshUser();
        window.location.reload();
      }
    } catch (e) {
      console.error("Failed to switch role:", e);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error("Failed to logout:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
