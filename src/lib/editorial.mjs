/** Stable editorial ordering: date first, then URL for ties. */
export function byPublicationDate(a, b) {
  return b.date.valueOf() - a.date.valueOf() || a.href.localeCompare(b.href);
}

/**
 * The hero is the newest piece of original work (article, architecture post or experiment), so it
 * never goes stale. Daily news and the guide catalogue never take it. The `featured` flag no longer pins it.
 */
const ORIGINAL_WORK = new Set(['article', 'architecture', 'experiment']);
export function selectFeatured(items) {
  const sorted = [...items].sort(byPublicationDate);
  return sorted.find((item) => ORIGINAL_WORK.has(item.kind)) ??
    sorted.find((item) => item.kind === 'guide') ??
    sorted[0];
}

/** Keep a unified date ordered feed while reserving room for slower formats. */
export function selectRecent(items, featuredHref, limit = 6) {
  const caps = { news: 2, experiment: 3, article: limit, architecture: limit, guide: 2 };
  const counts = { news: 0, experiment: 0, article: 0, architecture: 0, guide: 0 };
  return [...items]
    .filter((item) => item.href !== featuredHref)
    .sort(byPublicationDate)
    .filter((item) => {
      if (counts[item.kind] >= caps[item.kind]) return false;
      counts[item.kind] += 1;
      return true;
    })
    .slice(0, limit);
}
