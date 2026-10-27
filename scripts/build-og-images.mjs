#!/usr/bin/env node
/**
 * Letterbox experiment preview charts onto a white 1200×630 canvas for OG/Twitter.
 * Reads published experiments with previewImage from src/content/experiments/,
 * writes public/og/experiments/<id>.png without cropping labels.
 *
 * Usage: node scripts/build-og-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EXPERIMENTS_DIR = path.join(ROOT, 'src/content/experiments');
const OUT_DIR = path.join(ROOT, 'public/og/experiments');
const OG_W = 1200;
const OG_H = 630;
/** Padding inside the canvas so chart labels stay clear of the crop edge. */
const PAD = 36;

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const block = m[1];
  const get = (key) => {
    const re = new RegExp(`^${key}:\\s*(.*)$`, 'm');
    const hit = block.match(re);
    if (!hit) return undefined;
    return hit[1].trim().replace(/^["']|["']$/g, '');
  };
  return {
    draft: /^draft:\s*true\s*$/m.test(block),
    status: get('status'),
    previewImage: get('previewImage'),
  };
}

function listTargets() {
  const out = [];
  for (const name of fs.readdirSync(EXPERIMENTS_DIR)) {
    if (!name.endsWith('.md') && !name.endsWith('.mdx')) continue;
    const id = name.replace(/\.(md|mdx)$/, '');
    const text = fs.readFileSync(path.join(EXPERIMENTS_DIR, name), 'utf8');
    const fm = parseFrontmatter(text);
    if (!fm || fm.draft) continue;
    if (fm.status === 'planned' || fm.status === 'running') continue;
    if (!fm.previewImage) continue;
    const rel = fm.previewImage.replace(/^\//, '');
    const src = path.join(ROOT, 'public', rel);
    if (!fs.existsSync(src)) {
      console.warn(`skip ${id}: missing ${fm.previewImage}`);
      continue;
    }
    out.push({ id, src });
  }
  return out;
}

async function letterbox(srcPath, destPath) {
  const meta = await sharp(srcPath).metadata();
  const iw = meta.width ?? 1;
  const ih = meta.height ?? 1;
  const maxW = OG_W - PAD * 2;
  const maxH = OG_H - PAD * 2;
  const scale = Math.min(maxW / iw, maxH / ih);
  const tw = Math.max(1, Math.round(iw * scale));
  const th = Math.max(1, Math.round(ih * scale));
  const left = Math.floor((OG_W - tw) / 2);
  const top = Math.floor((OG_H - th) / 2);

  const chart = await sharp(srcPath)
    .resize(tw, th, { fit: 'fill', kernel: 'lanczos3' })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: OG_W,
      height: OG_H,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite([{ input: chart, left, top }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(destPath);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const targets = listTargets();
  if (targets.length === 0) {
    console.log('No published experiments with previewImage.');
    return;
  }
  for (const { id, src } of targets) {
    const dest = path.join(OUT_DIR, `${id}.png`);
    await letterbox(src, dest);
    const st = fs.statSync(dest);
    console.log(`wrote public/og/experiments/${id}.png (${st.size} bytes)`);
  }
  console.log(`done: ${targets.length} OG image(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
