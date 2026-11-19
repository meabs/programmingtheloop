import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectFeatured, selectRecent } from '../src/lib/editorial.mjs';

const item = (kind, day, featured = false) => ({
  kind, date: new Date(`2026-10-${String(day).padStart(2, '0')}`),
  href: `/${kind}/${day}/`, featured,
});

test('the hero is the newest original work; news and the guide never take it', () => {
  const items = [item('news', 28), item('guide', 27), item('experiment', 17), item('article', 24), item('architecture', 20)];
  assert.equal(selectFeatured(items).href, '/article/24/');
  assert.equal(selectFeatured([...items, item('experiment', 25)]).href, '/experiment/25/');
});

test('a featured flag no longer pins an older item', () => {
  const items = [item('experiment', 17, true), item('article', 24)];
  assert.equal(selectFeatured(items).href, '/article/24/');
});

test('with no original work the guide, then anything, is used', () => {
  assert.equal(selectFeatured([item('news', 21), item('guide', 20)]).kind, 'guide');
  assert.equal(selectFeatured([item('news', 21)]).kind, 'news');
});

test('recent items exclude the hero, cap news, and retain date order', () => {
  const items = [21, 20, 19, 18].map((day) => item('news', day));
  items.push(item('experiment', 17, true), item('guide', 16), item('experiment', 15));
  const recent = selectRecent(items, '/experiment/17/');
  assert.equal(recent.filter((entry) => entry.kind === 'news').length, 2);
  assert.deepEqual(recent.map((entry) => entry.href), ['/news/21/', '/news/20/', '/guide/16/', '/experiment/15/']);
});
