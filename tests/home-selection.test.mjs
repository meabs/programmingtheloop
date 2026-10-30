import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectHomeFindings, featuredFirst } from '../src/lib/home-selection.mjs';

const f = (id, extra = {}) => ({ id, status: 'current', ...extra });

test('ranked findings come first, lowest rank first, capped at three', () => {
  const all = [f('A-1', { homeRank: 3 }), f('B-1'), f('C-1', { homeRank: 1 }), f('D-1', { homeRank: 2 }), f('E-1', { homeRank: 4 })];
  assert.deepEqual(selectHomeFindings(all, ['B-1']).map((x) => x.id), ['C-1', 'D-1', 'A-1']);
});

test('fewer than three ranked: fill from the curated fallback, not from the newest', () => {
  const all = [f('A-1', { homeRank: 1 }), f('NEW-1'), f('B-1'), f('C-1')];
  assert.deepEqual(selectHomeFindings(all, ['B-1', 'C-1', 'A-1']).map((x) => x.id), ['A-1', 'B-1', 'C-1']);
});

test('no ranks at all: the curated list is used in order', () => {
  const all = [f('X-1'), f('B-1'), f('C-1'), f('A-1')];
  assert.deepEqual(selectHomeFindings(all, ['A-1', 'B-1', 'C-1']).map((x) => x.id), ['A-1', 'B-1', 'C-1']);
});

test('superseded findings are never shown, ranked or not', () => {
  const all = [f('A-1', { homeRank: 1, status: 'superseded' }), f('B-1'), f('C-1')];
  assert.deepEqual(selectHomeFindings(all, ['A-1', 'B-1', 'C-1']).map((x) => x.id), ['B-1', 'C-1']);
});

test('equal ranks are ordered by id so the result is stable', () => {
  const all = [f('B-1', { homeRank: 1 }), f('A-1', { homeRank: 1 })];
  assert.deepEqual(selectHomeFindings(all, []).map((x) => x.id), ['A-1', 'B-1']);
});

test('featured items first, the rest keep their order', () => {
  const items = [{ id: 'n1' }, { id: 'f1', featured: true }, { id: 'n2' }, { id: 'f2', featured: true }];
  assert.deepEqual(featuredFirst(items).map((x) => x.id), ['f1', 'f2', 'n1', 'n2']);
  assert.deepEqual(featuredFirst([{ id: 'a' }, { id: 'b' }]).map((x) => x.id), ['a', 'b']);
});
