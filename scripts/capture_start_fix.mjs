import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const OUT = 'docs/pr-screenshots';
const ART = '/opt/cursor/artifacts/screenshots';
mkdirSync(OUT, { recursive: true });
mkdirSync(ART, { recursive: true });

const shots = [
  { id: 'start_desktop_light', path: '/guides/programming-the-loop/start/', w: 1440, h: 900, theme: 'light' },
  { id: 'start_iphone_light', path: '/guides/programming-the-loop/start/', w: 390, h: 844, theme: 'light' },
  { id: 'start_desktop_dark', path: '/guides/programming-the-loop/start/', w: 1440, h: 900, theme: 'dark' },
  { id: 'start_iphone_dark', path: '/guides/programming-the-loop/start/', w: 390, h: 844, theme: 'dark' },
  { id: 'home_iphone_grids', path: '/', w: 390, h: 1400, theme: 'light', full: true },
  { id: 'guide_landing_iphone', path: '/guides/programming-the-loop/', w: 390, h: 900, theme: 'light' },
  { id: 'experiments_iphone_cards', path: '/experiments/', w: 390, h: 844, theme: 'light' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });

for (const s of shots) {
  await page.setViewportSize({ width: s.w, height: s.h });
  await page.goto(`${BASE}${s.path}`, { waitUntil: 'networkidle' });
  await page.evaluate((t) => {
    document.documentElement.dataset.theme = t;
    document.documentElement.style.colorScheme = t;
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('ptl-theme', t); } catch {}
  }, s.theme);
  await page.waitForTimeout(250);
  const name = `ia_${s.id}`;
  for (const dir of [OUT, ART]) {
    await page.screenshot({ path: join(dir, `${name}.png`), fullPage: !!s.full });
  }
  console.log('wrote', name);
}

await browser.close();
