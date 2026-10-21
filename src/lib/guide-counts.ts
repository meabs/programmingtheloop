/**
 * Structural Guide counts — computed from the guide tree / assets, not findings.
 * Used by guide landing chrome and check:content allowlists.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CHAPTERS } from '../site';

const GUIDE_DOCS =
  process.env.GUIDE_DOCS_DIR ||
  path.join(process.cwd(), 'src/content/docs/guides/programming-the-loop');
const GUIDE_IMAGES =
  process.env.GUIDE_IMAGES_DIR || path.join(process.cwd(), 'public/guide-images');

/** Count `- [ ]` checklist lines across Guide chapter Markdown (matches guide:verify). */
export function countGuideChecklistItems(docsDir = GUIDE_DOCS): number {
  if (!fs.existsSync(docsDir)) return 0;
  let n = 0;
  for (const name of fs.readdirSync(docsDir)) {
    if (!/\.(md|mdx)$/.test(name)) continue;
    const text = fs.readFileSync(path.join(docsDir, name), 'utf8');
    for (const line of text.split('\n')) {
      if (/^- \[ \]\s+/.test(line)) n += 1;
    }
  }
  return n;
}

/** Count charts/diagrams shipped under public/guide-images. */
export function countGuideFigures(imagesDir = GUIDE_IMAGES): number {
  if (!fs.existsSync(imagesDir)) return 0;
  return fs
    .readdirSync(imagesDir)
    .filter((n) => /\.(png|svg|webp|jpg|jpeg)$/i.test(n) && !n.startsWith('.'))
    .length;
}

export function getGuideStructureCounts() {
  return {
    chapters: CHAPTERS.length,
    checklistItems: countGuideChecklistItems(),
    figures: countGuideFigures(),
  };
}
