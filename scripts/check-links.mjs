/**
 * Fails when a built page links to an internal path that does not exist in dist/.
 * Run after `npm run build`. Checks href and src attributes that start with "/".
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export function resolves(urlPath, dist = DIST) {
  const clean = decodeURI(urlPath.split('#')[0].split('?')[0]);
  if (clean === '' || clean === '/') return existsSync(join(dist, 'index.html'));
  const target = join(dist, clean);
  if (existsSync(target) && statSync(target).isFile()) return true;
  if (existsSync(join(target, 'index.html'))) return true;
  if (existsSync(`${target}.html`)) return true;
  return false;
}

export function findBrokenLinks(dist = DIST) {
  if (!existsSync(dist)) throw new Error('dist/ not found: run `npm run build` first');
  const broken = new Map();
  for (const file of walk(dist).filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\b(?:href|src)="(\/[^"#?][^"]*|\/(?=["#?]))/g)) {
      const url = m[1];
      if (url.startsWith('//')) continue;
      if (!resolves(url, dist)) {
        const page = file.slice(dist.length).replace(/index\.html$/, '') || '/';
        const list = broken.get(url) ?? new Set();
        list.add(page);
        broken.set(url, list);
      }
    }
  }
  return broken;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const broken = findBrokenLinks();
  if (broken.size > 0) {
    for (const [url, pages] of broken) {
      console.error(`Broken internal link ${url} on ${[...pages].slice(0, 3).join(', ')}${pages.size > 3 ? ` (+${pages.size - 3} more)` : ''}`);
    }
    process.exit(1);
  }
  console.log('check:links ok');
}
