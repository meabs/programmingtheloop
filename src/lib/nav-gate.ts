/**
 * Single gate for collection-linked nav / chrome.
 * Used by getVisibleNav(), home stats/CTAs, footer links, and Starlight Site sidebar.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  NAV,
  NAV_MIN_ITEMS,
  type NavCollection,
  type NavItem,
} from '../site';

export type NavCounts = Record<NavCollection, number>;

/** True when published count meets the collection’s threshold. */
export function collectionMeetsThreshold(
  count: number,
  threshold: number = NAV_MIN_ITEMS,
): boolean {
  return count >= threshold;
}

/** Whether a nav item should appear given published counts. */
export function isNavItemVisible(item: NavItem, counts: NavCounts): boolean {
  if (item.always) return true;
  if (!item.collection) return true;
  const need = item.minItems ?? NAV_MIN_ITEMS;
  return collectionMeetsThreshold(counts[item.collection], need);
}

/**
 * Whether a collection-gated surface (nav link, CTA, stat, sidebar) should show.
 * Look up threshold from NAV (including per-item minItems overrides).
 */
export function collectionIsVisible(
  collection: NavCollection,
  counts: NavCounts,
): boolean {
  const item = NAV.find((n) => n.collection === collection);
  if (!item) return collectionMeetsThreshold(counts[collection]);
  return isNavItemVisible(item, counts);
}

/**
 * Filter nav to visible items and renumber sequentially (00, 01, 02…).
 * Static `num` on NAV is only a source-order hint; display nums come from here.
 */
export function visibleNavFromCounts(
  nav: readonly NavItem[],
  counts: NavCounts,
): NavItem[] {
  return nav
    .filter((item) => isNavItemVisible(item, counts))
    .map((item, index) => ({
      ...item,
      num: String(index).padStart(2, '0'),
    }));
}

/** Starlight “Site” sidebar links — same gate as main nav. */
export function siteSidebarItems(
  counts: NavCounts,
): { label: string; link: string }[] {
  return NAV.filter((item) => isNavItemVisible(item, counts)).map((item) => ({
    label: item.label,
    link: item.href,
  }));
}

/** Count published (non-draft) markdown entries in a content directory. */
function countPublishedInDir(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.md') && !name.endsWith('.mdx')) continue;
    const text = fs.readFileSync(path.join(dir, name), 'utf8');
    const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fm && /^draft:\s*true\s*$/m.test(fm[1])) continue;
    n += 1;
  }
  return n;
}

/**
 * Sync published counts from disk — for astro.config.mjs (no content layer yet).
 * Matches getCollection(..., draft !== true) for flat collection folders.
 */
export function readNavCollectionCountsSync(
  contentRoot = path.join(process.cwd(), 'src/content'),
): NavCounts {
  return {
    articles: countPublishedInDir(path.join(contentRoot, 'articles')),
    experiments: countPublishedInDir(path.join(contentRoot, 'experiments')),
    guides: countPublishedInDir(path.join(contentRoot, 'guides')),
  };
}
