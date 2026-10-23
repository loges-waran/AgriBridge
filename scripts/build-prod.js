const { execSync } = require("child_process");

console.log("==> [AgriBridge Build] Starting production build process...");

const dbUrl = process.env.DATABASE_URL || "";

if (dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://")) {
  console.log("==> [AgriBridge Build] PostgreSQL / Supabase detected. Synchronizing database tables...");
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("==> [AgriBridge Build] Database tables synchronized successfully!");
  } catch (err) {
    console.warn("==> [AgriBridge Build] Notice during db push:", err.message);
  }

  try {
    console.log("==> [AgriBridge Build] Populating initial records and seed data...");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    console.log("==> [AgriBridge Build] Seed records populated successfully!");
  } catch (seedErr) {
    console.warn("==> [AgriBridge Build] Notice during seed (records may already exist):", seedErr.message);
  }
} else {
  console.log("==> [AgriBridge Build] Local database environment detected.");
}

console.log("==> [AgriBridge Build] Generating Prisma Client...");
execSync("npx prisma generate", { stdio: "inherit" });

console.log("==> [AgriBridge Build] Running Next.js build...");
execSync("npx next build", { stdio: "inherit" });
