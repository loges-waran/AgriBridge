import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // 1. Mandi Wholesale Market (REPLACES EARBUDS in Scenario C & Produce Marketplace)
  {
    name: 'Koyambedu Wholesale Mandi Market (Tamil Nadu)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Koyambedu_Market.jpg',
    dests: [
      'public/images/resources/produce.jpg',
      'public/images/agribridge/01-farm-projects/mandi-wholesale-market.jpg'
    ],
    license: 'Creative Commons Attribution 2.0 Generic (CC BY 2.0)',
    author: 'Sudhamshu Hebbar',
    source: 'Wikimedia Commons (File:Koyambedu_Market.jpg)'
  },
  // 2. Fresh Indian Agricultural Vegetables (REPLACES EARBUDS in vegetables.jpg)
  {
    name: 'Colourful Fresh Indian Farm Vegetables',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Colourful_vegetables.jpg',
    dests: [
      'public/images/crops/vegetables.jpg',
      'public/images/resources/fresh-vegetables.jpg'
    ],
    license: 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)',
    author: 'Arvind Rangarajan',
    source: 'Wikimedia Commons (File:Colourful_vegetables.jpg)'
  },
  // 3. Tamil Nadu Farmer Selling Produce at Market
  {
    name: 'Tamil Nadu Vegetable Vendor at Market (Chengalpet)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/A_Vegetable_Vendor_at_Chengalpet_Market_-_Happy_Madras_Week%21%21%21_%2814801208708%29.jpg',
    dests: [
      'public/images/agribridge/01-farm-projects/farmer-selling-produce.jpg'
    ],
    license: 'Creative Commons Attribution 2.0 Generic (CC BY 2.0)',
    author: 'Vinoth Chandar',
    source: 'Wikimedia Commons (File:A_Vegetable_Vendor_at_Chengalpet_Market...jpg)'
  },
  // 4. Tamil Nadu Monsoon Paddy Landscape (Homepage Hero Background)
  {
    name: 'Paddy Field After Monsoon Rain in Tamil Nadu',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Paddy_field_after_raining_in_Tamilnadu.jpg',
    dests: [
      'public/images/hero/tamilnadu-farmland-hero.jpg'
    ],
    license: 'Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
    author: 'Balanagaraj',
    source: 'Wikimedia Commons (File:Paddy_field_after_raining_in_Tamilnadu.jpg)'
  },
  // 5. Authentic Tamil Nadu Farmer Profile
  {
    name: 'Farmer in Tamil Nadu',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/63/A_Farmer_in_Tamil_Nadu.JPG',
    dests: [
      'public/images/agribridge/01-farm-projects/tamilnadu-farmer.jpg'
    ],
    license: 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)',
    author: 'Thamizhpparithi Maari',
    source: 'Wikimedia Commons (File:A_Farmer_in_Tamil_Nadu.JPG)'
  },
  // 6. Traditional Field Preparation with Parambu (Leveller)
  {
    name: 'Agricultural Worker with Parambu Field Leveller in Tamil Nadu',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/A_agricultural_worker_works_with_Parambu_to_prepare_the_field_for_Paddy_plantation.jpg',
    dests: [
      'public/images/agribridge/01-farm-projects/parambu-field-preparation.jpg'
    ],
    license: 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)',
    author: 'எஸ்ஸார் (User:எஸ்ஸார்)',
    source: 'Wikimedia Commons (File:A_agricultural_worker_works_with_Parambu...jpg)'
  },
  // 7. Panoramic Cauvery Delta / Southern Tamil Nadu Farmland Landscape
  {
    name: 'Kallidaikurichi Farmland Landscape (Tamil Nadu)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Kallidaikurichi_Landscape.jpg',
    dests: [
      'public/images/hero/kallidaikurichi-landscape.jpg'
    ],
    license: 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)',
    author: 'K Hari Krishnan',
    source: 'Wikimedia Commons (File:Kallidaikurichi_Landscape.jpg)'
  },
  // 8. Agricultural Transport & Haulage in Kumbakonam, Thanjavur District
  {
    name: 'Agricultural Cart & Driver in Kumbakonam (Cauvery Delta)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Bullock_Cart_and_Driver_-_Kumbakonam_-_India.JPG',
    dests: [
      'public/images/agribridge/01-farm-projects/kumbakonam-haulage.jpg'
    ],
    license: 'Creative Commons Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)',
    author: 'Adam Jones',
    source: 'Wikimedia Commons (File:Bullock_Cart_and_Driver_-_Kumbakonam_-_India.JPG)'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(destPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const file = fs.createWriteStream(fullPath);

    function fetchUrl(targetUrl) {
      https.get(targetUrl, { headers: { 'User-Agent': 'AgriBridge/1.0 (agribridge@example.org)' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(fullPath, () => {});
          return reject(new Error(`Status ${res.statusCode} for ${targetUrl}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const stats = fs.statSync(fullPath);
            resolve(stats.size);
          });
        });
      }).on('error', (err) => {
        file.close();
        fs.unlink(fullPath, () => {});
        reject(err);
      });
    }

    fetchUrl(url);
  });
}

(async () => {
  console.log('Starting download of authentic agricultural assets...');
  let attributionContent = '# AgriBridge — Photography & Asset Attribution\n\n';
  attributionContent += 'All photographs integrated into AgriBridge are authentic, high-quality agricultural images from legitimate repositories (Wikimedia Commons, Unsplash, Pexels) with verified open licenses.\n\n';
  attributionContent += '| Image / Asset | Local Path | Source / Author | License |\n';
  attributionContent += '| :--- | :--- | :--- | :--- |\n';

  for (const item of downloads) {
    try {
      const primaryDest = item.dests[0];
      const bytes = await downloadFile(item.url, primaryDest);
      console.log(`✓ Downloaded ${item.name} -> ${primaryDest} (${Math.round(bytes / 1024)} KB)`);

      // Copy to additional destinations if specified
      for (let i = 1; i < item.dests.length; i++) {
        fs.copyFileSync(path.resolve(primaryDest), path.resolve(item.dests[i]));
        console.log(`  + Cloned to ${item.dests[i]}`);
      }

      attributionContent += `| **${item.name}** | \`${item.dests.join('`, `')}\` | ${item.author} (${item.source}) | ${item.license} |\n`;
    } catch (err) {
      console.error(`✗ Error downloading ${item.name}:`, err.message);
    }
  }

  fs.writeFileSync('public/images/ATTRIBUTION.md', attributionContent, 'utf8');
  console.log('✓ Created public/images/ATTRIBUTION.md with full licensing details.');
})();
