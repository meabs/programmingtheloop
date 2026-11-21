import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { selectUrls, buildPayload, KEY, KEY_LOCATION, HOST } from '../scripts/indexnow.mjs';

const xml = (rows) => `<?xml version="1.0"?><urlset>${rows.map(([u, l]) => `<url><loc>${u}</loc>${l ? `<lastmod>${l}</lastmod>` : ''}</url>`).join('')}</urlset>`;
const now = Date.parse('2026-11-21T12:00:00Z');

test('only URLs changed inside the window are selected, newest first', () => {
  const s = xml([
    ['https://x/a/', '2026-11-21T01:00:00.000Z'],
    ['https://x/b/', '2026-11-20T20:00:00.000Z'],
    ['https://x/old/', '2026-10-01T00:00:00.000Z'],
    ['https://x/none/', null],
  ]);
  assert.deepEqual(selectUrls(s, now, 48), ['https://x/a/', 'https://x/b/']);
});

test('a lastmod in the future (beyond clock skew) is ignored, and the list is capped', () => {
  const s = xml([['https://x/future/', '2027-01-01T00:00:00.000Z'], ['https://x/1/', '2026-11-21T11:00:00.000Z'], ['https://x/2/', '2026-11-21T10:00:00.000Z']]);
  assert.deepEqual(selectUrls(s, now, 48, 1), ['https://x/1/']);
});

test('the payload names the host, key and key location', () => {
  const p = buildPayload(['https://programmingtheloop.com/']);
  assert.equal(p.host, HOST);
  assert.equal(p.key, KEY);
  assert.equal(p.keyLocation, KEY_LOCATION);
  assert.match(KEY, /^[0-9a-f]{32}$/);
});

test('the key file is published at the key location and contains exactly the key', () => {
  const file = path.join(process.cwd(), 'public', `${KEY}.txt`);
  assert.ok(fs.existsSync(file));
  assert.equal(fs.readFileSync(file, 'utf8').trim(), KEY);
});
