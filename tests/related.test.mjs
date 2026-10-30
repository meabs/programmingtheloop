import { test } from 'node:test';
import assert from 'node:assert/strict';
import { relatedItems, neighbours } from '../src/lib/related.mjs';

const it = (href, kind, day, topics = []) => ({ href, kind, date: new Date(`2026-10-${String(day).padStart(2, '0')}`), topics });

test('shared topics first, most shared first, then newest', () => {
  const items = [
    it('/a/', 'article', 10, ['verification']),
    it('/e1/', 'experiment', 12, ['verification', 'harness']),
    it('/e2/', 'experiment', 20, ['harness']),
    it('/e3/', 'experiment', 5, ['skills']),
  ];
  const cur = it('/cur/', 'article', 25, ['verification', 'harness']);
  assert.deepEqual(relatedItems(cur, items, 3).map((x) => x.href), ['/e1/', '/e2/', '/a/']);
});

test('never includes the current post', () => {
  const cur = it('/cur/', 'article', 25, ['harness']);
  assert.ok(!relatedItems(cur, [cur, it('/x/', 'article', 1, ['harness'])]).some((x) => x.href === '/cur/'));
});

test('an untagged post falls back to the newest other writing, not experiments', () => {
  const items = [it('/e/', 'experiment', 29), it('/old/', 'article', 1), it('/new/', 'architecture', 20)];
  const cur = it('/cur/', 'article', 25);
  assert.deepEqual(relatedItems(cur, items, 2).map((x) => x.href), ['/new/', '/old/']);
});

test('topic matches are topped up with other writing up to the limit', () => {
  const items = [it('/m/', 'experiment', 3, ['harness']), it('/w1/', 'article', 4), it('/w2/', 'article', 8)];
  const cur = it('/cur/', 'article', 25, ['harness']);
  assert.deepEqual(relatedItems(cur, items, 3).map((x) => x.href), ['/m/', '/w2/', '/w1/']);
});

test('neighbours: older and newer within the list, undefined at the ends', () => {
  const list = [it('/b/', 'article', 2), it('/a/', 'article', 1), it('/c/', 'article', 3)];
  assert.deepEqual([neighbours(list, '/b/').older.href, neighbours(list, '/b/').newer.href], ['/a/', '/c/']);
  assert.equal(neighbours(list, '/a/').older, undefined);
  assert.equal(neighbours(list, '/c/').newer, undefined);
  assert.deepEqual(neighbours(list, '/missing/'), { older: undefined, newer: undefined });
});
