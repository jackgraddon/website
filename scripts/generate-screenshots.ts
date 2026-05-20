import fs from 'node:fs';
import path from 'node:path';
import { chromium, type Page } from 'playwright';
import { spawn } from 'node:child_process';

const TIMES = [
  { name: 'morning', hour: 8 },
  { name: 'afternoon', hour: 14 },
  { name: 'evening', hour: 20 },
  { name: 'night', hour: 3 }
];

// Optimized resolutions: 720p base, portrait for mobile
const ASPECT_RATIOS = {
  '1-1': { width: 720, height: 720 },
  '16-9': { width: 720, height: 405 },
  '9-16': { width: 390, height: 844 } // Standard mobile size
};

const URLS = [
  { path: '/', name: 'home' },
  { path: '/projects', name: 'projects' },
  { path: '/about', name: 'about' }
];

async function generate() {
  console.log('[Screenshot Generator] Spawning local dev server...');
  // Adjust 'npm run dev' to your specific dev command if needed
  const server = spawn('npm', ['run', 'dev'], { stdio: 'ignore' });

  // Wait 10 seconds for the server to spin up
  await new Promise(resolve => setTimeout(resolve, 10000));

  const browser = await chromium.launch();
  const publicDir = path.join(process.cwd(), 'public/screenshots');

  for (const time of TIMES) {
    console.log(`--- Capturing state: ${time.name.toUpperCase()} ---`);
    const context = await browser.newContext();

    // Mock the Date object to trigger your Background.client.vue logic
    await context.addInitScript(`{
      const date = new Date();
      date.setHours(${time.hour}, 0, 0, 0);
      Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) return date;
          return new Date(...args);
        }
      };
    }`);

    for (const target of URLS) {
      const page = await context.newPage();
      await page.goto(`http://localhost:3000${target.path}`);
      await page.waitForLoadState('networkidle');

      for (const [arName, vp] of Object.entries(ASPECT_RATIOS)) {
        await page.setViewportSize(vp);
        const dir = path.join(publicDir, time.name);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        await page.screenshot({ path: path.join(dir, `${target.name}-${arName}.png`) });
        console.log(`  ✓ Saved ${target.name} for ${time.name} (${arName})`);
      }
      await page.close();
    }
    await context.close();
  }

  await browser.close();
  server.kill();
  console.log('[Screenshot Generator] Done!');
}

generate();