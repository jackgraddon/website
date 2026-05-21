import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, type Page } from 'playwright';
import { spawn, type ChildProcess } from 'node:child_process';
import net from 'node:net';

const TIMES = [
  { name: 'morning', hour: 8 },
  { name: 'afternoon', hour: 14 },
  { name: 'evening', hour: 20 },
  { name: 'night', hour: 3 }
];

// Optimized resolutions: 720p base, portrait for mobile
const ASPECT_RATIOS = {
  '1-1': { width: 1080, height: 1080 },
  '16-9': { width: 1080, height: 720 },
  '4-3': { width: 1280, height: 960 },
  '9-16': { width: 390, height: 844 } // Standard mobile size
};

const URLS = [
  { path: 'https://jackgraddon.com/', name: 'home', time: true },
  { path: 'https://jackgraddon.com/projects', name: 'projects', time: true },
  { path: 'https://jackgraddon.com/about', name: 'about', time: true },
  { path: 'https://jackgraddon.com/contact', name: 'contact', time: true },
  { path: 'https://www.linkedin.com/in/jackgraddon', name: 'linkedin', time: false },
  { path: 'https://github.com/jackgraddon', name: 'github', time: false },
];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose') || args.includes('-v');
const log = (message: string) => {
  if (verbose) console.log(message);
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function loadAuthContext() {
  const authPath = path.join(process.cwd(), 'auth.json');
  if (!fs.existsSync(authPath)) {
    log('[Screenshot Generator] No auth.json found, skipping auth');
    return null;
  }

  try {
    const authContent = fs.readFileSync(authPath, 'utf-8');
    return JSON.parse(authContent);
  } catch (error) {
    log(`[Screenshot Generator] Failed to load auth.json: ${error}`);
    return null;
  }
}

function getHash(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

async function verifyLinkedInLogin(page: Page) {
  const currentUrl = page.url();
  if (currentUrl.includes('/login') || currentUrl.includes('/checkpoint/challenge')) {
    throw new Error(`LinkedIn authentication failed: landed on ${currentUrl}`);
  }

  const bodyText = await page.textContent('body');
  if (bodyText && /(please sign in|sign in to view|log in)/i.test(bodyText)) {
    throw new Error('LinkedIn authentication failed: login page detected');
  }
}

function normalizeLinkedInUrl(url: string) {
  return url.replace(/^https:\/\/linkedin\.com\//, 'https://www.linkedin.com/');
}

async function waitForPort(host: string, port: number, timeoutMs = 30000, onExit?: () => string | null) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (onExit) {
      const exitReason = onExit();
      if (exitReason) {
        throw new Error(`Dev server exited before listening: ${exitReason}`);
      }
    }

    const ready = await new Promise<boolean>(resolve => {
      const socket = new net.Socket();
      socket.setTimeout(1000);
      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('error', () => {
        socket.destroy();
        resolve(false);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.connect(port, host);
    });

    if (ready) {
      return;
    }

    await sleep(500);
  }
  throw new Error(`Dev server did not open ${host}:${port} within ${timeoutMs}ms`);
}

async function killProcessGroup(server: ChildProcess | null) {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch {
    // ignore if already down
  }

  await new Promise(resolve => {
    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve(undefined);
      }
    };
    server.once('exit', finish);
    setTimeout(finish, 5000);
  });
}

export async function generateScreenshots() {
  console.log('[Screenshot Generator] Spawning local dev server...');

  // Prefer running the local nuxt binary directly when available to avoid
  // extra shell/wrapper processes that can complicate cleanup.
  const nuxtPath = path.join(process.cwd(), 'node_modules', '.bin', 'nuxt');
  let server: ChildProcess;
  if (fs.existsSync(nuxtPath)) {
    server = spawn(nuxtPath, ['dev', '--host', '127.0.0.1', '--port', '3000'], {
      stdio: ['ignore', 'ignore', 'ignore'],
      detached: true
    });
  } else {
    server = spawn('npm', ['run', 'dev'], {
      stdio: ['ignore', 'ignore', 'ignore'],
      detached: true
    });
  }

  let serverExited = false;
  let serverExitReason: string | null = null;
  server.once('exit', (code, signal) => {
    serverExited = true;
    serverExitReason = `code=${code ?? 'null'} signal=${signal ?? 'null'}`;
  });
  server.once('error', err => {
    serverExited = true;
    serverExitReason = `spawn error: ${err.message}`;
  });

  console.log('[Screenshot Generator] Spawned server PID:', server.pid);

  const teardown = async () => {
    await killProcessGroup(server).catch(() => undefined);
  };
  process.once('exit', () => void teardown());
  process.once('SIGINT', () => { teardown().then(() => process.exit(130)); });
  process.once('SIGTERM', () => { teardown().then(() => process.exit(143)); });

  let browser = null;
  try {
    log('[Screenshot Generator] Waiting for dev server on 127.0.0.1:3000...');
    await waitForPort('127.0.0.1', 3000, 30000, () => serverExited ? serverExitReason : null);
    log('[Screenshot Generator] Dev server is ready.');

    if (dryRun) {
      console.log('[Screenshot Generator] Dry run complete. Server started and port is ready.');
      return;
    }

    browser = await chromium.launch();
    const publicDir = path.join(process.cwd(), 'public/screenshots');

    // Capture time-based screenshots
    for (const timeSlot of TIMES) {
      console.log(`--- Capturing state: ${timeSlot.name.toUpperCase()} ---`);
      const context = await browser.newContext();

      // Mock the Date object to trigger your Background.client.vue logic
      await context.addInitScript(`{
        const date = new Date();
        date.setHours(${timeSlot.hour}, 0, 0, 0);
        Date = class extends Date {
          constructor(...args) {
            if (args.length === 0) return date;
            return new Date(...args);
          }
        };
      }`);

      for (const target of URLS.filter(u => u.time)) {
        const page = await context.newPage();
        await page.goto(`${target.path}`);
        await page.waitForLoadState('networkidle');

        const normalizedTarget = getHash(target.path);
        for (const [arName, vp] of Object.entries(ASPECT_RATIOS)) {
          await page.setViewportSize(vp);
          const dir = path.join(publicDir, timeSlot.name);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

          await page.screenshot({ path: path.join(dir, `${normalizedTarget}-${arName}.png`) });
          console.log(`  ✓ Saved ${target.name} for ${timeSlot.name} (${arName})`);
        }
        await page.close();
      }
      await context.close();
    }

    // Capture static screenshots (external URLs)
    const authPath = path.join(process.cwd(), 'auth.json');
    const staticContextOptions: any = {};

    if (fs.existsSync(authPath)) {
      staticContextOptions.storageState = authPath;
      log('[Screenshot Generator] Loaded auth state from auth.json');
    } else {
      log('[Screenshot Generator] No auth.json available for static captures');
    }

    const staticContext = await browser.newContext(staticContextOptions);
    for (const target of URLS.filter(u => !u.time)) {
      const page = await staticContext.newPage();
      try {
        const targetUrl = normalizeLinkedInUrl(target.path);
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(2500);

        if (target.name === 'linkedin') {
          await verifyLinkedInLogin(page);
        }

        const normalizedTarget = getHash(targetUrl);
        for (const [arName, vp] of Object.entries(ASPECT_RATIOS)) {
          await page.setViewportSize(vp);
          const dir = path.join(publicDir, 'static');
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

          await page.screenshot({ path: path.join(dir, `${normalizedTarget}-${arName}.png`) });
          console.log(`  ✓ Saved ${target.name} (${arName})`);
        }
      } catch (error) {
        console.log(`  ✗ Failed to capture ${target.name}: ${error}`);
      } finally {
        await page.close();
      }
    }
    await staticContext.close();

    console.log('[Screenshot Generator] Done!');
  } finally {
    await browser?.close().catch(() => undefined);
    await killProcessGroup(server);
  }
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  generateScreenshots().catch(error => {
    console.error('[Screenshot Generator] Error:', error);
    process.exitCode = 1;
  });
}