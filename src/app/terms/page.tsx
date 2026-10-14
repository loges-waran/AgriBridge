import React from "react";

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20 bg-[#fbfbfa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-stone-900 mb-6">
          Terms of Agreement & Agricultural Protocol
        </h1>
        <div className="prose prose-stone text-xs leading-relaxed space-y-4 text-stone-600">
          <p className="font-semibold text-stone-800">
            Last Updated: October 2026 • Governing Law: Jurisdiction of Tamil Nadu, India
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">1. Non-Negotiable Platform Ethics</h2>
          <p>
            AgriBridge operates strictly as an agricultural coordination, resource matching, and verified workflow platform. AgriBridge does not promise guaranteed financial returns, does not operate as an unregistered collective investment scheme or non-banking financial company (NBFC), and does not guarantee biological crop yields against force majeure natural disasters.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">2. KYC Verification & Documentation</h2>
          <p>
            All participants (farmers, landowners, machinery owners, workers, suppliers, and traders) agree that identity documentation submitted (Aadhaar, Land Patta/Chitta, Trade License, Driving License) will be authenticated for legal authority to lease land, offer equipment, or sell agricultural harvest.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">3. Co-Farming & Profit-Sharing Contracts</h2>
          <p>
            Agreements between farmers and investors or landowners constitute bilateral agricultural contracts. All material inputs, labor expenses, and sales must be documented within the project financial ledger. Realized profits are disbursed only upon recorded, reconciled sale proceeds.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">4. Machinery & Equipment Lease Rules</h2>
          <p>
            Equipment reservations confirmed through the platform establish a binding duty of performance. Machinery owners must guarantee equipment roadworthiness and operating safety. In the event of mechanical breakdown during critical field windows, immediate notice and dispute mediation apply.
          </p>

          <h2 className="text-base font-bold text-stone-900 pt-3">5. Fair Labor & Wage Standards</h2>
          <p>
            Farmers hiring agricultural worker gangs must adhere to transparent wage agreements, prompt daily or milestone payment settlements, and provide humane working conditions in full compliance with local agricultural labor norms.
          </p>
        </div>
      </div>
    </div>
  );
}
