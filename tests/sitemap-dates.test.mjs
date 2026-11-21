import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readSitemapDatesSync } from '../src/lib/sitemap-dates.mjs';

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sitemap-dates-'));
  const write = (section, name, body) => {
    fs.mkdirSync(path.join(root, section), { recursive: true });
    fs.writeFileSync(path.join(root, section, name), body);
  };
  write('experiments', 'old.md', '---\ntitle: "Old"\ndate: 2026-10-01T09:00:00+00:00\ndraft: false\n---\nbody');
  write('experiments', 'new.md', '---\ntitle: "New"\ndate: "2026-11-02T10:30:00+01:00"\n---\nbody');
  write('experiments', 'draft.md', '---\ntitle: "Draft"\ndate: 2026-12-31\ndraft: true\n---\nbody');
  write('news', '2026-10-21.md', '---\ntitle: "Roundup"\ndate: 2026-10-21\n---\nbody');
  write('architecture', 'nodate.md', '---\ntitle: "No date"\n---\nbody');
  return root;
}

test('a post gets its own date, parsed from frontmatter, as an ISO string', () => {
  const d = readSitemapDatesSync(fixture());
  assert.equal(d.get('/experiments/old/'), '2026-10-01T09:00:00.000Z');
  assert.equal(d.get('/experiments/new/'), '2026-11-02T09:30:00.000Z');
  assert.equal(d.get('/news/2026-10-21/'), '2026-10-21T00:00:00.000Z');
});

test('drafts and posts without a date get no lastmod', () => {
  const d = readSitemapDatesSync(fixture());
  assert.equal(d.has('/experiments/draft/'), false);
  assert.equal(d.has('/architecture/nodate/'), false);
  assert.equal(d.has('/architecture/'), false);
});

test('a listing page takes its newest child and the home page the newest of all', () => {
  const d = readSitemapDatesSync(fixture());
  assert.equal(d.get('/experiments/'), '2026-11-02T09:30:00.000Z');
  assert.equal(d.get('/news/'), '2026-10-21T00:00:00.000Z');
  assert.equal(d.get('/'), '2026-11-02T09:30:00.000Z');
});

test('the real content directory yields a date for every published experiment', () => {
  const d = readSitemapDatesSync();
  const dir = path.join(process.cwd(), 'src/content/experiments');
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md')) continue;
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    if (/^draft:\s*true\s*$/m.test(text.split('---')[1] ?? '')) continue;
    assert.ok(d.has(`/experiments/${name.replace(/\.md$/, '')}/`), name);
  }
});
