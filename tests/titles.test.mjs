import { test } from 'node:test';
import assert from 'node:assert/strict';
import { displayTitle } from '../src/lib/titles.ts';

test('drops a trailing experiment id', () => {
  assert.equal(displayTitle('Can manipulated evidence mislead an AI security agent? (experiment EM)'), 'Can manipulated evidence mislead an AI security agent?');
});
test('keeps other parentheses and titles without an id', () => {
  assert.equal(displayTitle('Skills (and what they cost)'), 'Skills (and what they cost)');
  assert.equal(displayTitle('Plain title'), 'Plain title');
});
