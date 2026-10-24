import { getCollection, type CollectionEntry } from 'astro:content';
import { NAV, type NavItem, type NavCollection } from '../site';
import { selectFeatured, selectRecent } from './editorial.mjs';
import {
  collectionIsVisible,
  visibleNavFromCounts,
  type NavCounts,
} from './nav-gate';

export type Article = CollectionEntry<'articles'>;
export type ArchitecturePost = CollectionEntry<'architecture'>;
export type Experiment = CollectionEntry<'experiments'>;
export type GuideEntry = CollectionEntry<'guides'>;
export type NewsPost = CollectionEntry<'news'>;

export type LatestItem = {
  kind: 'article' | 'architecture' | 'experiment' | 'guide' | 'news';
  title: string;
  summary: string;
  date: Date;
  href: string;
  tag: string;
  featured: boolean;
};

export function formatItemDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export async function getPublishedArticles(): Promise<Article[]> {
  const posts = await getCollection('articles', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedArchitecture(): Promise<ArchitecturePost[]> {
  const posts = await getCollection('architecture', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedExperiments(): Promise<Experiment[]> {
  const items = await getCollection('experiments', ({ data }) =>
    data.draft !== true && data.status !== 'planned' && data.status !== 'running',
  );
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedGuides(): Promise<GuideEntry[]> {
  const items = await getCollection('guides', ({ data }) => data.draft !== true);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedNews(): Promise<NewsPost[]> {
  const items = await getCollection('news', ({ data }) => data.draft !== true);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function articleHref(post: Article): string {
  return `/articles/${post.id}/`;
}

export function architectureHref(post: ArchitecturePost): string {
  return `/architecture/${post.id}/`;
}

export function experimentHref(item: Experiment): string {
  return `/experiments/${item.id}/`;
}

export function newsHref(post: NewsPost): string {
  return `/news/${post.id}/`;
}

/** Published counts used to gate collection nav sections. */
export async function getNavCollectionCounts(): Promise<NavCounts> {
  const [articles, architecture, experiments, guides, news] = await Promise.all([
    getPublishedArticles(),
    getPublishedArchitecture(),
    getPublishedExperiments(),
    getPublishedGuides(),
    getPublishedNews(),
  ]);
  return {
    articles: articles.length,
    architecture: architecture.length,
    experiments: experiments.length,
    guides: guides.length,
    news: news.length,
  };
}

/**
 * Nav items visible under NAV_MIN_ITEMS, renumbered sequentially.
 * Home / About always; collection sections need ≥ threshold published items.
 * Gate logic lives in nav-gate.ts — keep all chrome callers on that helper.
 */
export async function getVisibleNav(): Promise<NavItem[]> {
  return visibleNavFromCounts(NAV, await getNavCollectionCounts());
}

/** Whether a collection-gated surface should show (CTA, stat, footer, section). */
export async function isCollectionNavVisible(
  collection: NavCollection,
): Promise<boolean> {
  return collectionIsVisible(collection, await getNavCollectionCounts());
}

/** Published material for homepage editorial selection. */
export async function getHomepageItems(): Promise<LatestItem[]> {
  const [articles, architecture, experiments, guides, news] = await Promise.all([
    getPublishedArticles(),
    getPublishedArchitecture(),
    getPublishedExperiments(),
    getPublishedGuides(),
    getPublishedNews(),
  ]);

  const items: LatestItem[] = [
    ...articles.map((a) => ({
      kind: 'article' as const,
      title: a.data.title,
      summary: a.data.summary ?? a.data.description,
      date: a.data.date,
      href: articleHref(a),
      tag: 'Article',
      featured: a.data.featured,
    })),
    ...architecture.map((a) => ({
      kind: 'architecture' as const,
      title: a.data.title,
      summary: a.data.summary ?? a.data.description,
      date: a.data.date,
      href: architectureHref(a),
      tag: 'Architecture',
      featured: a.data.featured,
    })),
    ...news.map((n) => ({
      kind: 'news' as const,
      title: n.data.title,
      summary: n.data.summary,
      date: n.data.date,
      href: newsHref(n),
      tag: 'News',
      featured: n.data.featured,
    })),
    ...experiments.map((e) => ({
      kind: 'experiment' as const,
      title: e.data.title,
      summary: e.data.summary,
      date: e.data.date,
      href: experimentHref(e),
      tag: e.data.type,
      featured: e.data.featured,
    })),
    ...guides.map((g) => ({
      kind: 'guide' as const,
      title: g.data.title,
      summary: g.data.summary,
      date: g.data.date,
      href: g.data.href,
      tag: 'Guide',
      featured: g.data.featured,
    })),
  ];

  return items;
}

export async function getHomepageSelection(limit = 6): Promise<{
  featured: LatestItem | undefined;
  recent: LatestItem[];
}> {
  const items = await getHomepageItems();
  const featured = selectFeatured(items) as LatestItem | undefined;
  return { featured, recent: selectRecent(items, featured?.href, limit) as LatestItem[] };
}

/** Newest items across articles, architecture, news, experiments and guides. */
export async function getLatestItems(limit = 5): Promise<LatestItem[]> {
  const items = await getHomepageItems();
  return items.sort((a, b) => b.date.valueOf() - a.date.valueOf()).slice(0, limit);
}
