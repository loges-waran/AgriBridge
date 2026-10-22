import { SignJWT } from "jose";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "agribridge_super_secure_jwt_token_secret_development_min_32_characters";
const key = new TextEncoder().encode(JWT_SECRET);

const dashboardRoles = [
  { role: "FARMER", path: "/dashboard/farmer" },
  { role: "LANDOWNER", path: "/dashboard/landowner" },
  { role: "INVESTOR", path: "/dashboard/investor" },
  { role: "WORKER", path: "/dashboard/worker" },
  { role: "BUYER", path: "/dashboard/buyer" },
  { role: "MACHINERY_OWNER", path: "/dashboard/machinery" },
  { role: "SUPPLIER", path: "/dashboard/supplier" },
  { role: "TRANSPORTER", path: "/dashboard/transporter" },
  { role: "ADMIN", path: "/dashboard/admin" },
];

async function verifyDashboards() {
  console.log("Starting verification of 9 authenticated stakeholder dashboards...");
  let failed = 0;

  for (const { role, path } of dashboardRoles) {
    try {
      // Find a user with this role
      const userRole = await prisma.userRole.findFirst({
        where: { role },
        include: { user: { include: { roles: true } } },
      });

      if (!userRole) {
        console.error(`[SKIP] No seed user found for role ${role}`);
        continue;
      }

      const user = userRole.user;
      const rolesList = user.roles.map((r) => r.role);

      const token = await new SignJWT({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        activeRole: role,
        roles: rolesList,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);

      const res = await fetch(`http://localhost:3000${path}`, {
        headers: {
          Cookie: `agribridge_session=${token}`,
        },
      });

      if (res.status === 200) {
        console.log(`[PASS] ${role.padEnd(16)} -> ${path} (200 OK)`);
      } else {
        console.error(`[FAIL] ${role.padEnd(16)} -> ${path} (${res.status})`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERR]  ${role}: ${err.message}`);
      failed++;
    }
  }

  await prisma.$disconnect();
  console.log(`\nDashboard verification complete. Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

verifyDashboards();
