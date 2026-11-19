/**
 * Related reading for a post: other pieces that share a topic (experiments included), best match first.
 * When too few share a topic, the gap is filled with the newest other writing, so a post is never a dead end.
 *
 * items: { href, kind, date, topics?: string[] }
 */
export function relatedItems(current, items, limit = 4) {
  const mine = new Set(current.topics ?? []);
  const others = items.filter((i) => i.href !== current.href);
  const scored = others
    .map((i) => ({ i, shared: (i.topics ?? []).filter((t) => mine.has(t)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.i.date.valueOf() - a.i.date.valueOf() || a.i.href.localeCompare(b.i.href))
    .map((x) => x.i);
  const out = scored.slice(0, limit);
  if (out.length < limit) {
    const fill = others
      .filter((i) => i.kind !== 'experiment' && !out.includes(i))
      .sort((a, b) => b.date.valueOf() - a.date.valueOf() || a.href.localeCompare(b.href));
    out.push(...fill.slice(0, limit - out.length));
  }
  return out;
}

/** Older and newer neighbours of `href` within one list, newest-first or any order. */
export function neighbours(items, href) {
  const sorted = [...items].sort((a, b) => a.date.valueOf() - b.date.valueOf() || a.href.localeCompare(b.href));
  const i = sorted.findIndex((x) => x.href === href);
  if (i < 0) return { older: undefined, newer: undefined };
  return { older: sorted[i - 1], newer: sorted[i + 1] };
}
