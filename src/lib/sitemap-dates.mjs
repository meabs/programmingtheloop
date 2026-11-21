/**
 * Last-modified dates for the sitemap, read from content frontmatter (for astro.config.mjs).
 * A post's date is its lastmod; a listing page's lastmod is its newest child; the home page's is the newest of all.
 * Drafts are skipped. Pages without a content date get no lastmod (an inaccurate one is worse than none).
 */
import fs from 'node:fs';
import path from 'node:path';

const SECTIONS = ['experiments', 'architecture', 'articles', 'news'];

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return m ? m[1] : '';
}

function field(fm, name) {
  const m = fm.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+?)["']?\\s*$`, 'm'));
  return m ? m[1].trim() : null;
}

/** Map of URL path (with trailing slash) to ISO date string. */
export function readSitemapDatesSync(contentRoot = path.join(process.cwd(), 'src/content')) {
  const dates = new Map();
  let overall = 0;
  for (const section of SECTIONS) {
    const dir = path.join(contentRoot, section);
    if (!fs.existsSync(dir)) continue;
    let newest = 0;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.md') && !name.endsWith('.mdx')) continue;
      const fm = frontmatter(fs.readFileSync(path.join(dir, name), 'utf8'));
      if (/^draft:\s*true\s*$/m.test(fm)) continue;
      const raw = field(fm, 'date');
      const t = raw ? Date.parse(raw) : NaN;
      if (Number.isNaN(t)) continue;
      const slug = name.replace(/\.mdx?$/, '');
      dates.set(`/${section}/${slug}/`, new Date(t).toISOString());
      newest = Math.max(newest, t);
    }
    if (newest) {
      dates.set(`/${section}/`, new Date(newest).toISOString());
      overall = Math.max(overall, newest);
    }
  }
  if (overall) dates.set('/', new Date(overall).toISOString());
  return dates;
}
