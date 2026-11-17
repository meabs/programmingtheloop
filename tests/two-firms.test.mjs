// Keeps the "Two firms, one model" article, the interactive page and the downloadable simulation consistent.
// Every number the article quotes about the model is recomputed here with public/two-firms/sim.js, which
// web/test_parity.mjs (inside the zip) checks against the Python simulator.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  paired, monteCarlo, AI_NATIVE, TRADITIONAL, SCENARIOS, DEFAULT_ASSUMPTIONS,
} from '../public/two-firms/sim.js';

const article = readFileSync(new URL('../src/content/articles/two-firms-one-model.md', import.meta.url), 'utf8');
const ZIP = new URL('../public/two-firms/two-firms-simulation.zip', import.meta.url).pathname;
const PAGE = readFileSync(new URL('../public/two-firms/index.html', import.meta.url), 'utf8');
const SIM = readFileSync(new URL('../public/two-firms/sim.js', import.meta.url), 'utf8');

const BASE = SCENARIOS.baseline;
const asm = over => ({ ...DEFAULT_ASSUMPTIONS, ...over });
const gap = (ai = {}, trad = {}, a = {}, runs = 2000) =>
  paired([{ ...AI_NATIVE, ...ai }, { ...TRADITIONAL, ...trad }], BASE, runs, 36, 42, asm(a));
const m = v => `${v < 0 ? '−' : '+'}£${(Math.abs(v) / 1e6).toFixed(2)}m`;
const k = v => `${v < 0 ? '−' : ''}£${Math.round(Math.abs(v) / 1000)}k`;
const cells = line => line.split('|').slice(1, -1).map(c => c.trim());
const row = prefix => {
  const line = article.split('\n').find(l => l.startsWith(`| ${prefix}`));
  assert.ok(line, `assumptions row not found: ${prefix}`);
  return cells(line);
};
function unzip(name) {
  try {
    return execFileSync('unzip', ['-p', ZIP, `two-firms-simulation/${name}`], { maxBuffer: 1 << 26 }).toString('utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return null; // no unzip on this machine: the zip checks are skipped
    throw e;
  }
}

test('the firm assumptions table matches sim.js', () => {
  const dec = v => v.toFixed(2).replace(/0$/, '');
  const expected = {
    'Delivery capacity': [String(TRADITIONAL.capacity), String(AI_NATIVE.capacity)],
    'Monthly staff cost': [`£${TRADITIONAL.monthly_staff_cost / 1000}k`, `£${AI_NATIVE.monthly_staff_cost / 1000}k`],
    'Monthly tooling': [`£${TRADITIONAL.ai_tool_cost / 1000}k`, `£${AI_NATIVE.ai_tool_cost / 1000}k`],
    'Token cost per work unit': [`£${TRADITIONAL.token_cost_per_work}`, `£${AI_NATIVE.token_cost_per_work}`],
    'Defect factor': [dec(TRADITIONAL.defect_factor), dec(AI_NATIVE.defect_factor)],
    'Review strength': [TRADITIONAL.review_strength.toFixed(2), AI_NATIVE.review_strength.toFixed(2)],
    'Decision cadence': ['quarterly (3 months)', 'monthly (1 month)'],
  };
  assert.equal(TRADITIONAL.decision_cadence, 3);
  assert.equal(AI_NATIVE.decision_cadence, 1);
  for (const [label, [trad, ai]] of Object.entries(expected)) {
    const c = row(label);
    assert.equal(c[1], trad, `${label}: traditional`);
    assert.equal(c[2], ai, `${label}: AI-heavy`);
    assert.equal(c[4], 'Invented', `${label}: status`);
  }
});

test('the shared assumptions table matches sim.js', () => {
  const a = DEFAULT_ASSUMPTIONS;
  const expected = {
    'Revenue per customer': `£${a.arpu} a month`,
    'Running cost per customer': `£${a.cost_per_customer} a month`,
    'Common overhead': `£${a.overhead / 1000}k a month`,
    'Technical debt per unit of build work': String(a.debt_per_build),
    'How much review cuts that debt': a.review_effect.toFixed(2),
    'Debt slows delivery above': String(a.throttle_start),
    'Debt raises incident risk and churn above': String(a.debt_threshold),
    'Base monthly churn': `${(a.churn_base * 100).toFixed(1)}%`,
  };
  for (const [label, want] of Object.entries(expected)) {
    const c = row(label);
    assert.equal(c[1], want, label);
    assert.equal(c.at(-1), 'Invented', `${label}: status`);
  }
  assert.match(row('Starting position')[1], new RegExp(`£${a.start_cash / 1e6}m cash`));
  // the optional downturn is off by default, so it can't leak into any baseline number
  assert.equal(a.downturn_months, 0);
  assert.equal(a.downturn_mult, 1);
});

test('the headline statistics in the article are what the model gives', () => {
  const r = gap();
  assert.equal((r.win_fraction * 100).toFixed(1), '45.5');
  assert.equal((r.win_ci95 * 100).toFixed(1), '2.2');
  assert.equal(Math.round(r.mean_cash_diff / 1000), -144);
  assert.equal(Math.round(r.mean_cash_diff_ci95 / 1000), 54);
  for (const text of ['**45.5% ±2.2**', 'finishes £144k behind on average (±£54k)']) {
    assert.ok(article.includes(text), `article should say: ${text}`);
  }
});

test('the tornado figures quoted in the article match the model', () => {
  const swings = {
    'Traditional staff cost': () => [gap({}, { monthly_staff_cost: 205000 * 0.8 }), gap({}, { monthly_staff_cost: 205000 * 1.2 })],
    'AI-heavy defect factor': () => [gap({ defect_factor: 1.35 * 0.8 }), gap({ defect_factor: 1.35 * 1.2 })],
    'AI-heavy staff cost': () => [gap({ monthly_staff_cost: 150000 * 0.8 }), gap({ monthly_staff_cost: 150000 * 1.2 })],
    'technical debt per unit of build work': () => [gap({}, {}, { debt_per_build: 0.068 * 0.8 }), gap({}, {}, { debt_per_build: 0.068 * 1.2 })],
    'traditional delivery capacity': () => [gap({}, { capacity: 100 * 0.8 }), gap({}, { capacity: 100 * 1.2 })],
  };
  for (const [label, f] of Object.entries(swings)) {
    const [lo, hi] = f().map(r => r.mean_cash_diff);
    const a = Math.min(lo, hi), b = Math.max(lo, hi);
    assert.ok(article.toLowerCase().includes(`${label.toLowerCase()}, from ${m(a)} to ${m(b)}`), `${label}: ${m(a)} to ${m(b)}`);
  }
  // overhead is paid by both firms, so it cancels out of the gap exactly
  const lo = gap({}, {}, { overhead: 20000 }, 300).mean_cash_diff;
  const hi = gap({}, {}, { overhead: 90000 }, 300).mean_cash_diff;
  assert.ok(Math.abs(lo - hi) < 1e-3, `overhead should cancel: ${lo} vs ${hi}`);
  assert.ok(article.includes('Common overhead moves it by exactly nothing'));
});

test('quoted tipping points sit between a sign change in the average gap', () => {
  const tips = [
    ['AI-heavy defect factor', v => gap({ defect_factor: v }), 1.32],
    ['traditional staff cost', v => gap({}, { monthly_staff_cost: v }), 208900],
    ['AI-heavy capacity', v => gap({ capacity: v }), 141.4],
  ];
  for (const [label, f, tip] of tips) {
    const below = f(tip * 0.9).mean_cash_diff, above = f(tip * 1.1).mean_cash_diff;
    assert.ok(below * above < 0, `${label}: the sign should change around ${tip} (${below}, ${above})`);
    assert.ok(Math.abs(f(tip).mean_cash_diff) < 150000, `${label}: gap near zero at ${tip}`);
  }
  assert.ok(article.includes('| AI-heavy defect factor (1.35) | 1.32 |'));
  assert.ok(article.includes('| Traditional staff cost (£205k) | £208.9k |'));
  assert.ok(article.includes('| AI-heavy delivery capacity (135) | 141.4 |'));
});

test('the structure checks quoted in the article match the model', () => {
  const t = gap({}, {}, { debt_threshold: 40 });
  assert.equal((t.win_fraction * 100).toFixed(1), '61.9');
  assert.equal(k(t.mean_cash_diff), '£263k');
  assert.ok(article.includes('from winning 45.5% to 61.9%'));
  assert.ok(article.includes('£144k behind to £263k ahead'));
  const quarterly = gap({ decision_cadence: 3 });
  const monthly = gap();
  assert.equal(Math.round((monthly.mean_cash_diff - quarterly.mean_cash_diff) / 1000), 53);
  assert.ok(article.includes('is about £53k'));
});

test('fixed seeds reproduce exactly', () => {
  const a = gap({}, {}, { debt_per_build: 0.09, churn_base: 0.02 }, 150);
  const b = gap({}, {}, { debt_per_build: 0.09, churn_base: 0.02 }, 150);
  assert.deepEqual(a, b);
});

test('the shipped original (v0.1) results still reproduce in sim.js', () => {
  const summary = unzip('results/summary.json');
  if (summary === null) return;
  for (const entry of JSON.parse(summary)) {
    const got = monteCarlo(200, 36, SCENARIOS[entry.scenario], 42);
    assert.equal(got.ai_native_cash_win_fraction, entry.ai_native_cash_win_fraction, entry.scenario);
    assert.deepEqual(got.median_final_cash_gbp, entry.median_final_cash_gbp, entry.scenario);
    assert.deepEqual(got.survival_fraction, entry.survival_fraction, entry.scenario);
  }
});

test('the download is the same simulator and page that are published', () => {
  const zippedSim = unzip('web/sim.js');
  if (zippedSim === null) return;
  assert.equal(zippedSim, SIM, 'zip web/sim.js should equal public/two-firms/sim.js');
  assert.equal(unzip('web/index.html'), PAGE, 'zip web/index.html should equal public/two-firms/index.html');
  // ASSUMPTIONS.md in the zip mirrors the article's tables
  const doc = unzip('ASSUMPTIONS.md');
  for (const label of ['Delivery capacity', 'Defect factor', 'Review strength', 'Common overhead', 'Base monthly churn']) {
    assert.ok(doc.includes(row(label).join(' | ')), `ASSUMPTIONS.md should contain the article row for ${label}`);
  }
});

test('the interactive page reads its defaults from sim.js and labels the firm AI-heavy', () => {
  assert.match(PAGE, /import \{[^}]*DEFAULT_ASSUMPTIONS[^}]*\} from '\.\/sim\.js'/);
  assert.match(PAGE, /const DEFAULTS = Object\.fromEntries\(Object\.keys\(PARAMS\)\.map\(key => \[key, defaultOf\(key\)\]\)\)/);
  assert.ok(!/AI-native firm/.test(PAGE.replace(/The code still calls this firm "AI-native"/, '')), 'the page should say AI-heavy');
  assert.match(PAGE, /<option value="2000" selected>/, 'the default precision should match the article (2,000 runs)');
});
