import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visibleNavigation, navItemIsActive } from '../src/lib/nav-visibility.mjs';

test('first published item reveals a section and empty sections stay hidden', () => {
  const nav = [
    { label: 'Findings', always: true },
    { label: 'Experiments', collection: 'experiments' },
    { label: 'About', always: true },
  ];
  const visible = visibleNavigation(nav, { experiments: 0 });
  assert.deepEqual(visible.map(({ label }) => label), ['Findings', 'About']);
  assert.deepEqual(visibleNavigation(nav, { experiments: 1 }).map(({ label }) => label), ['Findings', 'Experiments', 'About']);
});

test('a hub over several collections shows when any of them has items', () => {
  const nav = [{ label: 'Writing', collections: ['articles', 'architecture', 'news'] }];
  assert.equal(visibleNavigation(nav, { articles: 0, architecture: 0, news: 0 }).length, 0);
  assert.equal(visibleNavigation(nav, { articles: 0, architecture: 0, news: 2 }).length, 1);
});

test('a section is active for its own href and for its match prefixes', () => {
  const writing = { href: '/writing/', match: ['/writing/', '/articles/', '/news/'] };
  assert.equal(navItemIsActive(writing, '/articles/some-post/'), true);
  assert.equal(navItemIsActive(writing, '/news/2026-10-27/'), true);
  assert.equal(navItemIsActive(writing, '/experiments/'), false);
  assert.equal(navItemIsActive({ href: '/about/' }, '/about/methodology/'), true);
});
