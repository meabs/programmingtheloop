#!/usr/bin/env node
/**
 * Tell IndexNow search engines (Bing, Yandex, Seznam, Naver and others; not Google) which URLs changed.
 * Runs after a deploy: reads the live sitemap, picks URLs whose lastmod is in the last WINDOW_HOURS, and posts them.
 * Never fails a deploy: any problem is printed and the script exits 0.
 *
 * The key is public by design: IndexNow verifies ownership by fetching public/<key>.txt from the site.
 */
import { pathToFileURL } from 'node:url';

export const HOST = 'programmingtheloop.com';
export const KEY = 'a3f817fd7b56d7b4b369feb34b728629';
export const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
export const ENDPOINT = 'https://api.indexnow.org/IndexNow';
export const WINDOW_HOURS = 48;
export const MAX_URLS = 200;

/** URLs from a sitemap whose lastmod is within windowHours of now, newest first, capped. */
export function selectUrls(sitemapXml, now = Date.now(), windowHours = WINDOW_HOURS, max = MAX_URLS) {
  const out = [];
  for (const m of sitemapXml.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)) {
    const [, loc, lastmod] = m;
    const t = lastmod ? Date.parse(lastmod) : NaN;
    if (Number.isNaN(t)) continue;
    if (now - t <= windowHours * 3600 * 1000 && t <= now + 3600 * 1000) out.push({ loc, t });
  }
  return out.sort((a, b) => b.t - a.t).slice(0, max).map((x) => x.loc);
}

export function buildPayload(urlList) {
  return { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
}

async function main() {
  const wait = Number(process.env.INDEXNOW_WAIT_SECONDS ?? 0);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait * 1000));
  const res = await fetch(`https://${HOST}/sitemap-0.xml`);
  if (!res.ok) { console.log(`indexnow: sitemap fetch failed (${res.status}); nothing sent`); return; }
  const urls = selectUrls(await res.text());
  if (urls.length === 0) { console.log('indexnow: no URLs changed in the window; nothing sent'); return; }
  if (process.argv.includes('--dry-run')) { console.log(JSON.stringify(buildPayload(urls), null, 2)); return; }
  const post = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(buildPayload(urls)),
  });
  console.log(`indexnow: sent ${urls.length} URL(s); response ${post.status} ${post.statusText}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((e) => console.log(`indexnow: skipped (${e.message})`));
}
