const images = [
  "/images/hero/tamilnadu-farmland-hero.jpg",
  "/images/hero/kallidaikurichi-landscape.jpg",
  "/images/agribridge/01-farm-projects/parambu-field-preparation.jpg",
  "/images/agribridge/01-farm-projects/tamilnadu-farmer.jpg",
  "/images/agribridge/01-farm-projects/farmer-selling-produce.jpg",
  "/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg",
  "/images/resources/produce.jpg",
  "/images/crops/vegetables.jpg",
  "/images/agribridge/01-farm-projects/green-paddy-field.jpg",
  "/images/agribridge/01-farm-projects/paddy-transplanting.jpg",
  "/images/agribridge/01-farm-projects/planting-seedlings.jpg",
  "/images/agribridge/01-farm-projects/rice-field-workers.jpg",
  "/images/agribridge/01-farm-projects/carrying-rice-seedlings.jpg",
  "/images/agribridge/01-farm-projects/monsoon-ploughing.jpg",
  "/images/agribridge/01-farm-projects/traditional-ox-ploughing.jpg",
  "/images/agribridge/01-farm-projects/farmer-with-cattle.jpg",
  "/images/agribridge/02-funding-and-investment/farmer-funding-growth.jpg",
  "/images/agribridge/02-funding-and-investment/green-investment-growth.jpg",
  "/images/agribridge/02-funding-and-investment/sustainable-investment-growth.jpg",
  "/images/machinery/tractor.jpg",
  "/images/machinery/harvester.jpg",
  "/images/machinery/drone.jpg",
  "/images/machinery/tiller.jpg",
  "/images/resources/fertilizer.jpg",
  "/images/resources/seeds.jpg",
  "/images/crops/turmeric.jpg",
  "/images/crops/banana.jpg"
];

async function verifyImages() {
  console.log("Verifying image static serving from http://localhost:3000...");
  let failed = 0;
  for (const img of images) {
    try {
      const res = await fetch(`http://localhost:3000${img}`);
      if (res.status === 200) {
        console.log(`[PASS] ${img}`);
      } else {
        console.error(`[FAIL] ${img} -> ${res.status}`);
        failed++;
      }
    } catch (e) {
      console.error(`[ERR]  ${img} -> ${e.message}`);
      failed++;
    }
  }
  console.log(`\nImage verification complete. Total: ${images.length}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

verifyImages();
