/**
 * Capture IA restructure screenshots: desktop + iPhone, light + dark.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const OUT = process.env.OUT_DIR || 'docs/pr-screenshots';
const ART = process.env.ART_DIR || '/opt/cursor/artifacts/screenshots';

mkdirSync(OUT, { recursive: true });
mkdirSync(ART, { recursive: true });

const pages = [
  { id: 'home', path: '/' },
  { id: 'experiments', path: '/experiments/' },
  { id: 'experiment-okf', path: '/experiments/okf-worked-example/' },
  { id: 'guides', path: '/guides/' },
  { id: 'guide-landing', path: '/guides/programming-the-loop/' },
];

const viewports = [
  { id: 'desktop', width: 1440, height: 900 },
  { id: 'iphone', width: 390, height: 844 },
];

const themes = ['light', 'dark'];

async function shot(page, name) {
  const dests = [join(OUT, `${name}.png`), join(ART, `${name}.png`)];
  for (const dest of dests) {
    await page.screenshot({ path: dest, fullPage: false });
  }
  console.log('wrote', name);
}

const browser = await chromium.launch();
const context = await browser.newContext({
  deviceScaleFactor: 2,
  colorScheme: 'light',
});
const page = await context.newPage();

for (const theme of themes) {
  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const p of pages) {
      await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        document.documentElement.style.colorScheme = t;
        try {
          localStorage.setItem('ptl-theme', t);
        } catch {}
      }, theme);
      // Starlight pages may use data-theme on html already; force again after paint
      await page.waitForTimeout(200);
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
        document.documentElement.style.colorScheme = t;
        // Starlight
        document.documentElement.setAttribute('data-theme', t);
      }, theme);
      await page.waitForTimeout(150);
      const name = `ia_${p.id}_${vp.id}_${theme}`;
      await shot(page, name);
    }
  }
}

await browser.close();
console.log('done');
