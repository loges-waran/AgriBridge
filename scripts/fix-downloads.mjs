import fs from 'fs';
import path from 'path';
import https from 'https';

// Tested and verified working Unsplash photo IDs
const fixes = [
  // Tractor: photo-1592982537447-7440770cbfc9 (green tractor in field) or photo-1589923188900-85dae523342b
  {
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
    dest: 'public/images/machinery/tractor.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
    dest: 'public/images/machinery/default-machinery.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&q=80',
    dest: 'public/images/machinery/rotavator.jpg'
  },
  // Irrigation / Pump: photo-1563514227147-6d2ff665a6a0 (water irrigation in crops)
  {
    url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80',
    dest: 'public/images/resources/irrigation.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&q=80',
    dest: 'public/images/machinery/pump.jpg'
  },
  // Labour / Farm workers: photo-1605000797499-95a51c5269ae (workers harvesting crops)
  {
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=80',
    dest: 'public/images/resources/labour.jpg'
  },
  // Advisory Hero: photo-1593113598332-cd288d649433 or photo-1605000797499-95a51c5269ae
  {
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1400&q=80',
    dest: 'public/images/hero/advisory-hero.jpg'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(destPath);
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
  for (const item of fixes) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.error(`Failed ${item.dest}:`, err.message);
    }
  }
  console.log('Fixed downloads completed.');
}

run();
