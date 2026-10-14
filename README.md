# AgriBridge — Unified Agriculture Collaboration & Resource Coordination Platform

AgriBridge is a unified agriculture ecosystem platform that connects farmers with the people, capital, labour, machinery, agricultural supplies, buyers, transportation, and agronomic expertise required to execute complete farming projects.

Built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** backed by an ACID-compliant persistent relational database.

---

## 🌟 The AgriBridge Journey

AgriBridge treats a farming project as an integrated operational venture:
```
Create a Farming Project → Identify Missing Resource Gaps → Run Deterministic Matching Engine →
Establish Bilateral Agreement Terms → Reserve Machinery & Labour → Execute Cultivation Milestones →
Track Real Itemized Expenses → Pre-Harvest Buyer Contract → Logistics & Mandi Haulage →
Transparent Financial Reconciliation
```

---

## 👥 9 Supported Stakeholder Personas

1. **Farmer / Cultivator:** Farm registration, crop cycles, missing resource declaration, worker hiring, machinery booking, produce sales.
2. **Landowner:** Farmland parcel registry, Patta/Chitta revenue verification, lease & sharecropping terms.
3. **Agri-Investor:** Direct co-farming capital, milestone-based disbursements, transparent profit sharing, risk disclosures.
4. **Farm Worker / Gang Leader:** Skill profiles, team size, wage expectations, availability calendars, job applications.
5. **Produce Buyer / Mandi Trader:** Spot and pre-harvest forward contracts, quality grade specifications, order fulfillment.
6. **Machinery Owner:** Tractors, combine harvesters, drone sprayers, rental schedules, trained operator assignments.
7. **Input Supplier:** Certified seeds, bio-NPK fertilizers, botanical bio-pesticides, drip kits, automated inventory tracking.
8. **Transport Provider:** 3.5T mini-trucks, 10T grain lorries, cold-chain refrigerated containers, route haulage quotes.
9. **Platform Administrator:** KYC verification queue, listing moderation, grievance dispute mediation, audit ledger.

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v20+ or v24 LTS (verified on Node.js v24.20.0, npm 11.19.0)
- **Git**

### Installation
```bash
# 1. Clone or navigate to the AgriBridge workspace
cd AgriBridge

# 2. Install dependencies
npm install

# 3. Synchronize persistent database schema
npx prisma db push

# 4. Populate verified DEMO records (All 9 personas & Cauvery Delta projects)
npx tsx prisma/seed.ts

# 5. Run the 20-journey automated integration test suite
npm run test:runner

# 6. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Quick Demo Login Credentials (1-Click Evaluator Access)

All demo accounts use the standard password: `AgriBridge2026!`

| Role | Demo Email | Focus / Sample Project |
| :--- | :--- | :--- |
| **Farmer** | `farmer@agribridge.org` | Kuruvai Organic Ponni Paddy 2026 (5 Acres, Thanjavur) |
| **Landowner** | `landowner@agribridge.org` | Thiruvaiyaru Riverbank Farmlands (Patta Verified) |
| **Investor** | `investor@agribridge.org` | ₹65,000 Working Capital Co-Investment (22.5% Profit Share) |
| **Worker** | `worker@agribridge.org` | 6-Worker Experienced Paddy Transplanting & Harvest Crew |
| **Buyer** | `buyer@agribridge.org` | Sundaram Wholesale Grain Merchants (Madurai Mandi) |
| **Machinery Owner** | `machinery@agribridge.org` | John Deere 5050D 4WD Tractor + Agras 16L Drone Sprayer |
| **Supplier** | `supplier@agribridge.org` | Cauvery Bio-Inputs & Certified Seed Distribution Hub |
| **Transporter** | `transporter@agribridge.org` | 3.5T & 10T Agricultural Grain Haulage Fleet |
| **Administrator** | `admin@agribridge.org` | Platform Governance, KYC Queue & Dispute Mediation |

*Tip: You can also use the 1-click **Quick Demo Login** bar directly on the homepage and login page to switch between personas instantly.*

---

## 🏗️ Technology Architecture

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Earth & Agricultural Green Design Tokens
- **Icons**: Lucide React
- **Database & Persistence**: SQLite via Prisma ORM (ACID-compliant, persistent file `./prisma/agribridge.db`, PostgreSQL-ready schema)
- **Authentication**: Stateless signed JWT sessions in HTTP-only `SameSite=Lax` cookies (`jose` + `bcryptjs`)
- **Validation**: Schema-level server-side validation (`zod`)
- **Localization**: Tamil (`ta`) and English (`en`) context switcher

---

## 🧪 Automated Testing (Phase 11)

AgriBridge includes a dedicated integration test suite covering **20 critical end-to-end user journeys**:
```bash
npm run test:runner
```

### Verified Acceptance Journeys (20 / 20 PASS)
1. ✅ User registration, login, logout, and session recovery
2. ✅ Multi-role assignment and role switching on one account
3. ✅ Farmer creates and edits a farm project
4. ✅ Farmer identifies and declares missing resource gaps
5. ✅ Worker registers availability and applies for a job
6. ✅ Farmer accepts an eligible worker gang
7. ✅ Machinery owner lists equipment and confirms rental booking
8. ✅ Farmer orders agricultural inputs with ACID inventory decrement
9. ✅ Farmer creates pre-harvest produce listing
10. ✅ Buyer submits offer and places purchase order with net proceeds calculation
11. ✅ Transport provider accepts shipment with Proof of Delivery (POD)
12. ✅ Investor expresses interest in a farming proposal
13. ✅ Bilateral agreement terms established and recorded
14. ✅ Project milestones and actual expenses logged
15. ✅ Financial records and transaction ledger reconciled
16. ✅ Administrator reviews and approves KYC verification
17. ✅ User submits grievance and administrator records resolution
18. ✅ Unauthorized users denied access (cryptographic rejection)
19. ✅ SQLite ACID persistence verified across separate connection instances
20. ✅ External provider failures do not corrupt internal records (Graceful fallback)

---

## 📁 Key Routes

- **Public**: `/` (Home), `/how-it-works`, `/services`, `/about`, `/contact`, `/terms`, `/privacy`
- **Auth**: `/login`, `/register`
- **Dashboards**:
  - `/dashboard/farmer`
  - `/dashboard/landowner`
  - `/dashboard/investor`
  - `/dashboard/worker`
  - `/dashboard/buyer`
  - `/dashboard/machinery`
  - `/dashboard/supplier`
  - `/dashboard/transporter`
  - `/dashboard/admin`
- **Farm Projects**:
  - `/projects` (Project directory with filters)
  - `/projects/new` (5-step Project Builder Wizard)
  - `/projects/[id]` (Project Workspace & Budget)
  - `/projects/[id]/matches` (Resource Gap Engine)
  - `/projects/matches` (Global Match Portal)
- **Marketplaces**:
  - `/marketplaces/labour`
  - `/marketplaces/machinery`
  - `/marketplaces/inputs`
  - `/marketplaces/produce`
  - `/marketplaces/transport`
  - `/marketplaces/land`
  - `/marketplaces/investment`
- **Governance & Intelligence**:
  - `/admin/verifications` (KYC Queue)
  - `/admin/disputes` (Grievance Mediation)
  - `/intelligence/crop-advisory`
  - `/intelligence/budget-calculator`
  - `/intelligence/weather-risks`
  - `/agreements`
  - `/financials`
  - `/notifications`
