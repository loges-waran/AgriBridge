const routes = [
  "/",
  "/marketplaces/labour",
  "/marketplaces/machinery",
  "/marketplaces/inputs",
  "/marketplaces/produce",
  "/marketplaces/transport",
  "/marketplaces/land",
  "/marketplaces/investment",
  "/intelligence/crop-advisory",
  "/intelligence/weather-risks",
  "/intelligence/budget-calculator",
  "/projects",
  "/projects/matches",
  "/projects/new",
  "/login",
  "/register"
];

async function checkRoutes() {
  console.log("Starting verification of routes on http://localhost:3000...");
  let failed = 0;
  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`);
      if (res.status === 200) {
        console.log(`[PASS] ${r} -> 200 OK`);
      } else {
        console.error(`[FAIL] ${r} -> ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERR]  ${r} -> ${e.message}`);
      failed++;
    }
  }
  console.log(`\nVerification complete. Total: ${routes.length}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

checkRoutes();
