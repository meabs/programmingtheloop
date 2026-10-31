/**
 * Findings for the homepage strip: those with a `homeRank` first (lowest rank first, ties by id),
 * then the curated fallback ids, never "newest", so an exploratory or minor result cannot slip in.
 */
export function selectHomeFindings(findings, fallbackIds, limit = 3) {
  const live = findings.filter((f) => f.status !== 'superseded');
  const out = live
    .filter((f) => Number.isFinite(f.homeRank))
    .sort((a, b) => a.homeRank - b.homeRank || a.id.localeCompare(b.id))
    .slice(0, limit);
  for (const id of fallbackIds) {
    if (out.length >= limit) break;
    const f = live.find((x) => x.id === id);
    if (f && !out.includes(f)) out.push(f);
  }
  return out;
}

/** Featured items first, everything else keeps its existing (newest-first) order. */
export function featuredFirst(items) {
  return [...items.filter((i) => i.featured), ...items.filter((i) => !i.featured)];
}

/**
 * Newest written pieces (articles and architecture posts) for the home page, newest first, never the one
 * already shown in the hero.
 * items: { href, date, ... }
 */
export function latestWriting(items, excludeHref, limit = 5) {
  return items
    .filter((i) => i.href !== excludeHref)
    .sort((a, b) => b.date.valueOf() - a.date.valueOf() || a.href.localeCompare(b.href))
    .slice(0, limit);
}

/** Newest experiments for the carousel, never the one already shown in the hero. */
export function latestExperiments(items, excludeHref, limit = 5) {
  return latestWriting(items, excludeHref, limit);
}
