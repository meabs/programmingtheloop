import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.PREVIEW_URL || 'http://127.0.0.1:4321';
const OUT = 'docs/pr-screenshots';
const ART = '/opt/cursor/artifacts/screenshots';
mkdirSync(OUT, { recursive: true });
mkdirSync(ART, { recursive: true });

async function save(page, name) {
  for (const dir of [OUT, ART]) {
    await page.screenshot({ path: join(dir, `${name}.png`), fullPage: false });
  }
  console.log('wrote', name);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });

async function theme(t) {
  await page.evaluate((theme) => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('ptl-theme', theme); } catch {}
  }, t);
}

// Ch3 Heavy/Lean — iPhone
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/guides/programming-the-loop/right-facts/#the-documentation-layout-itself`, {
  waitUntil: 'networkidle',
});
await theme('light');
await page.waitForTimeout(400);
const heading = page.locator('h2, h3', { hasText: 'documentation layout' }).first();
await heading.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await save(page, 'ia_ch3_heavy_lean_iphone_light');

await theme('dark');
await page.waitForTimeout(200);
await save(page, 'ia_ch3_heavy_lean_iphone_dark');

// Desktop Heavy/Lean
await page.setViewportSize({ width: 1280, height: 900 });
await page.goto(`${BASE}/guides/programming-the-loop/right-facts/#the-documentation-layout-itself`, {
  waitUntil: 'networkidle',
});
await theme('light');
await page.waitForTimeout(300);
await heading.scrollIntoViewIfNeeded().catch(() => {});
const compare = page.locator('.design-compare').first();
await compare.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await save(page, 'ia_ch3_heavy_lean_desktop_light');

// Ch3 figure caption visible
await page.goto(`${BASE}/guides/programming-the-loop/right-facts/`, { waitUntil: 'networkidle' });
await theme('light');
const fig = page.locator('.guide-figure').first();
await fig.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await save(page, 'ia_ch3_figure_caption_desktop_light');

// Ch5 Limits wording (was What it shows)
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/guides/programming-the-loop/proof-not-promises/`, { waitUntil: 'networkidle' });
await theme('light');
const limits = page.locator('text=*Limits.*').last();
await limits.scrollIntoViewIfNeeded().catch(async () => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
});
await page.waitForTimeout(250);
await save(page, 'ia_ch5_limits_iphone_light');

// Guide index without duplicate stats table
await page.goto(`${BASE}/guides/programming-the-loop/`, { waitUntil: 'networkidle' });
await theme('light');
await page.waitForTimeout(200);
await save(page, 'ia_guide_index_iphone_light');

await browser.close();
