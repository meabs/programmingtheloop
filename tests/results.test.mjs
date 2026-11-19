import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toResultPoint, axisFor, statusText } from '../src/lib/results.ts';

const iv = (low, high, method = 'bootstrap 95% CI') => ({ low, high, method });

test('points: estimate and interval parse, excluding zero', () => {
  const p = toResultPoint({ value: '+67.5 pts', interval: iv('+53.3 pts', '+80.8 pts', 'Holm p < 0.001') });
  assert.deepEqual([p.kind, p.est, p.low, p.high, p.status], ['pts', 67.5, 53.3, 80.8, 'excludes-null']);
});

test('points: interval that crosses zero', () => {
  const p = toResultPoint({ value: '+3.8 pts', interval: iv('−1.6 pts', '+9.2 pts') });
  assert.equal(p.status, 'includes-null');
  assert.equal(statusText(p), 'Interval includes zero');
});

test('the adjusted conclusion wins even when the unadjusted interval excludes zero', () => {
  const p = toResultPoint({ value: '−6.7 pts', interval: iv('−13.3 pts', '−0.8 pts', 'the Holm-adjusted test governs the conclusion: no measurable difference') });
  assert.equal(p.status, 'no-difference');
});

test('ratios use 1 as no change', () => {
  const p = toResultPoint({ value: '1.98×', interval: iv('1.54', '2.41') });
  assert.deepEqual([p.kind, p.est, p.nullAt, p.status], ['ratio', 1.98, 1, 'excludes-null']);
});

test('an unparseable value gives an interval without a marker', () => {
  const p = toResultPoint({ value: '+35–48%', interval: iv('1.38', '1.60') });
  assert.equal(p.kind, 'ratio');
  assert.equal(p.est, null);
});

test('a value outside its interval is not drawn as a marker', () => {
  const p = toResultPoint({ value: '0.59', interval: iv('+1.0 pts', '+19.8 pts') });
  assert.equal(p.est, null);
});

test('plain proportions have no null line', () => {
  const p = toResultPoint({ value: '18%', interval: iv('11%', '27%', 'Wilson 95% interval') });
  assert.deepEqual([p.kind, p.est, p.nullAt, p.status], ['pct', 18, null, 'none']);
});

test('no interval means no plot', () => {
  assert.equal(toResultPoint({ value: '63/80' }), null);
});

test('axis includes the null line and positions it inside', () => {
  const pts = [toResultPoint({ value: '+0.8 pts', interval: iv('+0.0 pts', '+2.5 pts') })];
  const a = axisFor(pts);
  assert.ok(a.pos(0) > 0 && a.pos(0) < 100);
});
