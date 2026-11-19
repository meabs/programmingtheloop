import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findBrokenLinks, resolves } from '../scripts/check-links.mjs';

function site(files) {
  const dir = mkdtempSync(join(tmpdir(), 'ptl-links-'));
  for (const [path, body] of Object.entries(files)) {
    const full = join(dir, path);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, body);
  }
  return dir;
}

test('resolves pages, files and anchors', () => {
  const dir = site({ 'index.html': '', 'about/index.html': '', 'downloads/a.pdf': 'x' });
  assert.equal(resolves('/', dir), true);
  assert.equal(resolves('/about/#top', dir), true);
  assert.equal(resolves('/downloads/a.pdf', dir), true);
  assert.equal(resolves('/missing/', dir), false);
});

test('reports a broken internal link once per url with the pages it is on', () => {
  const dir = site({
    'index.html': '<a href="/about/">ok</a><a href="/gone/">bad</a><a href="https://example.com/x">ext</a>',
    'about/index.html': '<a href="/gone/">bad again</a><img src="/missing.png">',
  });
  const broken = findBrokenLinks(dir);
  assert.deepEqual([...broken.keys()].sort(), ['/gone/', '/missing.png']);
  assert.deepEqual([...broken.get('/gone/')].sort(), ['/', '/about/']);
});

test('a clean site has no broken links', () => {
  const dir = site({ 'index.html': '<a href="/a/">a</a>', 'a/index.html': '<a href="/">home</a>' });
  assert.equal(findBrokenLinks(dir).size, 0);
});
