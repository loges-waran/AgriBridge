# AgriBridge Production Deployment & Operations Guide

## 1. Hosting Architecture Options

AgriBridge is architected as a cohesive Next.js 15 application that can be deployed to:
1. **Node.js Production Server / Docker** (AWS EC2, DigitalOcean, Azure App Service)
2. **Serverless / Edge Platforms** (Vercel, Cloudflare Pages with Node adapter)
3. **Database**: The Prisma schema is SQLite locally and 100% PostgreSQL / Supabase ready for production.

---

## 2. Environment Variables Configuration

Create a `.env.production` file with the following verified values:

```env
# Database Connection (Switch to PostgreSQL / Supabase in production)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/agribridge?schema=public"

# Cryptographic Session Key (Generate a 64+ char random hex string)
JWT_SECRET="generate_a_super_secure_random_production_jwt_secret_key_minimum_64_characters"

# Platform Metadata
NEXT_PUBLIC_APP_NAME="AgriBridge"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_DEFAULT_LOCALE="en"

# Optional External Integrations (Fallback mode active if blank)
WEATHER_API_KEY=""
PAYMENT_GATEWAY_KEY=""
PAYMENT_GATEWAY_SECRET=""
SMS_API_KEY=""
```

---

## 3. Switching from SQLite to PostgreSQL / Supabase

1. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Generate migration:
   ```bash
   npx prisma migrate dev --name init_production
   ```
3. Deploy migration to production database:
   ```bash
   npx prisma migrate deploy
   ```

---

## 4. Docker Container Deployment

Create a `Dockerfile` in the root:
```dockerfile
FROM node:24-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

---

## 5. Security & Row-Level Authorization Checklist

- [x] Passwords salted and hashed with `bcryptjs` (Cost factor 10)
- [x] Session tokens signed with `jose` using HS256 and stored in `httpOnly`, `SameSite=Lax` cookies
- [x] Input sanitization and payload validation enforced via `Zod` on all API endpoints
- [x] Role-Based Access Control (RBAC) enforced on server routes (`admin`, `farmer`, `buyer`, etc.)
- [x] ACID database transactions for inventory changes and multi-record creation
- [x] Private identity records protected from unauthorized cross-user disclosure
- [x] Explicit developer notice displayed indicating payments and demo records are simulated in test mode

---

## 6. Pilot Testing Next Steps

1. **User Acceptance Testing (UAT) in Thanjavur / Cauvery Delta cluster**:
   - Recruit 5 farmers, 2 machinery owners, and 3 produce traders.
   - Run the full cycle: Create Kuruvai paddy project $\to$ match 4WD tractor $\to$ agree on ₹950/hr rate $\to$ log harvest $\to$ agree on forward buyer contract.
2. **KYC Verification Onboarding**:
   - Integrate Tamil Nadu Revenue Department e-Patta verification endpoint for real-time land survey number verification.
3. **SMS Gateway Integration**:
   - Connect Twilio / Gupshup for SMS alerts to farm workers who do not use smartphones.
