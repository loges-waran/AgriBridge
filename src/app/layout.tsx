import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n/context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AgriBridge — Unified Agriculture Collaboration & Resource Coordination Platform",
  description:
    "Connecting Indian farmers with land, capital, skilled labour, machinery, certified inputs, buyers, and transport to execute successful agricultural projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fbfbfa] text-stone-900 antialiased selection:bg-[#24593c] selection:text-white">
        <AuthProvider>
          <I18nProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
