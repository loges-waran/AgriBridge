import React from "react";

export default function PrivacyPage() {
  return (
    <div className="py-12 md:py-20 bg-[#fbfbfa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-6">
          Privacy Policy & Data Governance
        </h1>
        <div className="prose prose-stone text-xs leading-relaxed space-y-4 text-stone-600">
          <p className="font-semibold text-stone-800">
            Last Updated: October 2026 • Commitment to Agricultural Data Sovereignty
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">1. Data Ownership</h2>
          <p>
            Farmers retain complete ownership of their farm survey boundaries, yield history, and financial accounts. AgriBridge does not sell individual farmer soil or crop data to predatory third-party advertisers.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">2. Identity & KYC Protection</h2>
          <p>
            Identity documents (Aadhaar, Land Patta records, Trade Licenses) uploaded for verification are stored in secure object storage with authorized administrator-only access and are never displayed publicly on marketplace search engines.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">3. Geographic & Operational Privacy</h2>
          <p>
            Public produce and machinery listings display district-level geographic regions. Exact farm survey numbers and parcel coordinates are disclosed only to confirmed contract partners upon mutual agreement.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">4. Security Standards</h2>
          <p>
            All network communication is encrypted over HTTPS/TLS. Passwords are salted and hashed using cryptographic industry standards (bcrypt/Argon2). Session authentication uses secure HTTP-only SameSite cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
