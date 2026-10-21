import { test } from 'node:test';
import assert from 'node:assert/strict';
import { visibleNavigation } from '../src/lib/nav-visibility.mjs';

test('first published item reveals a section and empty sections stay hidden', () => {
  const nav = [
    { label: 'Home', always: true },
    { label: 'Articles', collection: 'articles' },
    { label: 'News', collection: 'news' },
    { label: 'About', always: true },
  ];
  const visible = visibleNavigation(nav, { articles: 0, news: 1 });
  assert.deepEqual(visible.map(({ label, num }) => [label, num]), [
    ['Home', '00'], ['News', '01'], ['About', '02'],
  ]);
});
