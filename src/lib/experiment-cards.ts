/**
 * Helpers for experiment listing cards: honest headlines when a CI crosses zero.
 */

export type CardFinding = {
  value?: string;
  metric?: string;
  statement?: string;
  interval?: { low: string; high: string; method: string };
};

/** Parse a signed points / number string like "+8.3 pts" or "−5.0". */
export function parseSignedNumber(raw: string): number | null {
  const cleaned = raw
    .replace(/pts?/gi, '')
    .replace(/×/g, '')
    .replace(/,/g, '')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .trim();
  const m = cleaned.match(/^[+-]?\d+(?:\.\d+)?/);
  if (!m) return null;
  return Number(m[0]);
}

/** True when a bootstrap interval has a negative low and a positive high. */
export function intervalCrossesZero(
  interval: { low: string; high: string } | undefined | null,
): boolean {
  if (!interval) return false;
  const low = parseSignedNumber(interval.low);
  const high = parseSignedNumber(interval.high);
  if (low === null || high === null) return false;
  return low < 0 && high > 0;
}

/**
 * Prefer "N of M … against P of M" / "N of M against P" patterns in the statement.
 * Returns e.g. "40 vs 38 of 60 · not measurable".
 */
export function honestHeadlineFromStatement(statement: string): string | null {
  const of = statement.match(
    /(\d+)\s+of\s+(\d+)\s+runs?\s+passed[^.]*?(?:against|vs\.?)\s+(\d+)\s+of\s+\2/i,
  );
  if (of) return `${of[1]} vs ${of[3]} of ${of[2]} · not measurable`;

  const short = statement.match(
    /(\d+)\s+of\s+(\d+)\s*[^.]*?(?:against|vs\.?)\s+(\d+)(?:\s+of\s+\2)?/i,
  );
  if (short) {
    const denom = short[2];
    const right = short[0].includes(`of ${denom}`)
      ? `${short[1]} vs ${short[3]} of ${denom}`
      : `${short[1]} vs ${short[3]} of ${denom}`;
    return `${right} · not measurable`;
  }
  return null;
}

/**
 * Card headline: when the finding's CI crosses zero, show counts + "not measurable"
 * instead of a bare signed points figure.
 */
export function cardHeadline(finding: CardFinding | undefined | null): {
  text: string;
  notMeasurable: boolean;
} | null {
  if (!finding?.value) return null;
  if (intervalCrossesZero(finding.interval) && finding.statement) {
    const honest = honestHeadlineFromStatement(finding.statement);
    if (honest) return { text: honest, notMeasurable: true };
    return { text: `${finding.value} · not measurable`, notMeasurable: true };
  }
  return { text: finding.value, notMeasurable: false };
}
