/**
 * Turns a finding's value and interval strings into numbers for the results plot.
 * Nothing is invented: a marker is drawn only when the value parses in the same unit as the interval.
 */
/** Parse "+8.3 pts", "−5.0", "2.41" (kept local so Node can load this file in tests without an import extension). */
function parseSignedNumber(raw: string): number | null {
  const m = raw
    .replace(/pts?/gi, '')
    .replace(/[×,]/g, '')
    .replace(/[−–]/g, '-')
    .trim()
    .match(/^[+-]?\d+(?:\.\d+)?/);
  return m ? Number(m[0]) : null;
}

export type ResultKind = 'pts' | 'ratio' | 'pct';

export type ResultPoint = {
  kind: ResultKind;
  /** Point estimate, or null when the value cannot be read in the interval's unit. */
  est: number | null;
  low: number;
  high: number;
  /** Where "no change" sits for this unit (0 for points, 1 for ratios); none for a plain proportion. */
  nullAt: number | null;
  status: 'none' | 'includes-null' | 'excludes-null' | 'no-difference';
};

type FindingLike = {
  value?: string;
  interval?: { low: string; high: string; method: string };
};

const NO_DIFFERENCE = /no measurable difference|not measurable|not significant|governs the conclusion/i;

function kindOf(f: FindingLike): ResultKind | null {
  const { low, high } = f.interval ?? { low: '', high: '' };
  const v = f.value ?? '';
  if (/pts?\b/i.test(low) || /pts?\b/i.test(high)) return 'pts';
  if (/%/.test(low) && /%/.test(high)) return 'pct';
  if (/×/.test(v) || (/^\d+(\.\d+)?$/.test(low.trim()) && /^\d+(\.\d+)?$/.test(high.trim()))) return 'ratio';
  return null;
}

function estimateOf(kind: ResultKind, value: string | undefined): number | null {
  const v = (value ?? '').trim();
  if (kind === 'pts' && /^[+\-−–]?\d+(\.\d+)?\s*pts?$/i.test(v)) return parseSignedNumber(v);
  if (kind === 'ratio' && /^\d+(\.\d+)?×$/.test(v)) return parseSignedNumber(v);
  if (kind === 'pct' && /^\d+(\.\d+)?%$/.test(v)) return parseSignedNumber(v.replace('%', ''));
  return null;
}

export function toResultPoint(f: FindingLike | undefined | null): ResultPoint | null {
  if (!f?.interval) return null;
  const kind = kindOf(f);
  if (!kind) return null;
  const low = parseSignedNumber(kind === 'pct' ? f.interval.low.replace('%', '') : f.interval.low);
  const high = parseSignedNumber(kind === 'pct' ? f.interval.high.replace('%', '') : f.interval.high);
  if (low === null || high === null || low > high) return null;
  let est = estimateOf(kind, f.value);
  if (est !== null && (est < low || est > high)) est = null;
  const nullAt = kind === 'pts' ? 0 : kind === 'ratio' ? 1 : null;
  let status: ResultPoint['status'] = 'none';
  const text = `${f.value ?? ''} ${f.interval.method}`;
  if (nullAt !== null) {
    status = low < nullAt && high > nullAt ? 'includes-null' : 'excludes-null';
    if (NO_DIFFERENCE.test(text)) status = 'no-difference';
  }
  return { kind, est, low, high, nullAt, status };
}

export type Axis = {
  min: number;
  max: number;
  nullAt: number | null;
  /** 0–100 position for a value. */
  pos: (v: number) => number;
};

/** One shared axis for rows of the same unit, so intervals can be compared by eye. */
export function axisFor(points: ResultPoint[]): Axis {
  const nullAt = points[0]?.nullAt ?? null;
  const vals = points.flatMap((p) => [p.low, p.high]);
  if (nullAt !== null) vals.push(nullAt);
  let min = Math.min(...vals);
  let max = Math.max(...vals);
  const pad = (max - min || 1) * 0.06;
  min -= pad;
  max += pad;
  return { min, max, nullAt, pos: (v) => ((v - min) / (max - min)) * 100 };
}

export function formatPoint(kind: ResultKind, v: number): string {
  const abs = Math.abs(v);
  const s = abs >= 100 ? abs.toFixed(0) : abs.toFixed(abs % 1 === 0 ? 0 : 1);
  if (kind === 'ratio') return `${s}×`;
  if (kind === 'pct') return `${s}%`;
  return `${v < 0 ? '−' : v > 0 ? '+' : ''}${s}`;
}

export function nullWord(kind: ResultKind): string {
  return kind === 'ratio' ? '1×' : 'zero';
}

export function statusText(p: ResultPoint): string | null {
  switch (p.status) {
    case 'no-difference':
      return 'No measurable difference';
    case 'includes-null':
      return `Interval includes ${nullWord(p.kind)}`;
    case 'excludes-null':
      return `Interval excludes ${nullWord(p.kind)}`;
    default:
      return null;
  }
}

export function kindCaption(kind: ResultKind): string {
  if (kind === 'ratio') return 'Ratio, 95% interval (1× is no change)';
  if (kind === 'pct') return 'Proportion, 95% interval';
  return 'Difference in percentage points, 95% interval';
}
