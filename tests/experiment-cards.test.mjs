import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  intervalCrossesZero,
  honestHeadlineFromStatement,
  cardHeadline,
  parseSignedNumber,
} from '../src/lib/experiment-cards.ts';

test('intervalCrossesZero detects bootstrap intervals that include zero', () => {
  assert.equal(intervalCrossesZero({ low: '−8.3 pts', high: '+16.7 pts' }), true);
  assert.equal(intervalCrossesZero({ low: '+5.0 pts', high: '+36.7 pts' }), false);
  assert.equal(intervalCrossesZero(undefined), false);
});

test('honestHeadlineFromStatement builds the not-measurable card line', () => {
  assert.equal(
    honestHeadlineFromStatement(
      'Repository guidance left for the agent to discover did not measurably raise the pass rate: 40 of 60 runs passed, against 38 of 60 without it (p = 0.40)',
    ),
    '40 vs 38 of 60 · not measurable',
  );
});

test('cardHeadline keeps significant signed values', () => {
  const h = cardHeadline({
    value: '+21.7 pts',
    interval: { low: '+5.0 pts', high: '+36.7 pts', method: 'bootstrap' },
    statement: 'passed 49 of 60 runs against 36 of 60',
  });
  assert.deepEqual(h, { text: '+21.7 pts', notMeasurable: false });
});

test('parseSignedNumber accepts unicode minus', () => {
  assert.equal(parseSignedNumber('−5.0 pts'), -5);
});
