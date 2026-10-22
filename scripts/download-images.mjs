import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // Crops
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    dest: 'public/images/crops/paddy.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&q=80',
    dest: 'public/images/crops/turmeric.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80',
    dest: 'public/images/crops/banana.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    dest: 'public/images/crops/organic.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    dest: 'public/images/crops/sugarcane.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1601055283742-8b27e81b5553?w=800&q=80',
    dest: 'public/images/crops/cotton.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
    dest: 'public/images/crops/groundnut.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
    dest: 'public/images/crops/maize.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&q=80',
    dest: 'public/images/crops/vegetables.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    dest: 'public/images/crops/default-crop.jpg'
  },

  // Machinery
  {
    url: 'https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80',
    dest: 'public/images/machinery/tractor.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
    dest: 'public/images/machinery/harvester.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
    dest: 'public/images/machinery/drone.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=800&q=80',
    dest: 'public/images/machinery/tiller.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618047-f4fd3f39e886?w=800&q=80',
    dest: 'public/images/machinery/pump.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80',
    dest: 'public/images/machinery/rotavator.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1605338198618-e02f8e0aa01a?w=800&q=80',
    dest: 'public/images/machinery/default-machinery.jpg'
  },

  // Resources
  {
    url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    dest: 'public/images/resources/seeds.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
    dest: 'public/images/resources/fertilizer.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=800&q=80',
    dest: 'public/images/resources/pesticide.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618047-f4fd3f39e886?w=800&q=80',
    dest: 'public/images/resources/irrigation.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=800&q=80',
    dest: 'public/images/resources/labour.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    dest: 'public/images/resources/transport.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    dest: 'public/images/resources/land.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&q=80',
    dest: 'public/images/resources/produce.jpg'
  },

  // Hero & General
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80',
    dest: 'public/images/hero/dashboard-hero.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1592530392525-e26f4a1dff47?w=1400&q=80',
    dest: 'public/images/hero/advisory-hero.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    dest: 'public/images/fallback.jpg'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(destPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(fullPath);
    
    function get(targetUrl) {
      https.get(targetUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return get(response.headers.location);
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(fullPath, () => {});
          return reject(new Error(`Status ${response.statusCode} for ${targetUrl}`));
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const stats = fs.statSync(fullPath);
            console.log(`Downloaded: ${destPath} (${Math.round(stats.size / 1024)} KB)`);
            resolve();
          });
        });
      }).on('error', (err) => {
        file.close();
        fs.unlink(fullPath, () => {});
        reject(err);
      });
    }

    get(url);
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} assets...`);
  for (const item of downloads) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.error(`Failed ${item.dest}:`, err.message);
    }
  }
  console.log('Finished downloading image assets.');
}

run();
