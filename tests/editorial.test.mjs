import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectFeatured, selectRecent } from '../src/lib/editorial.mjs';

const item = (kind, day, featured = false) => ({
  kind, date: new Date(`2026-10-${String(day).padStart(2, '0')}`),
  href: `/${kind}/${day}/`, featured,
});

test('explicit feature wins, with a deterministic substantial-content fallback', () => {
  const items = [item('news', 21), item('experiment', 17), item('guide', 20)];
  assert.equal(selectFeatured(items).kind, 'experiment');
  assert.equal(selectFeatured([...items, item('guide', 1, true)]).href, '/guide/1/');
});

test('recent items exclude the hero, cap news, and retain date order', () => {
  const items = [21, 20, 19, 18].map((day) => item('news', day));
  items.push(item('experiment', 17, true), item('guide', 16), item('experiment', 15));
  const recent = selectRecent(items, '/experiment/17/');
  assert.equal(recent.filter((entry) => entry.kind === 'news').length, 2);
  assert.deepEqual(recent.map((entry) => entry.href), ['/news/21/', '/news/20/', '/guide/16/', '/experiment/15/']);
});
