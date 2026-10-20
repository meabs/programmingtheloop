import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;
export type Experiment = CollectionEntry<'experiments'>;
export type GuideEntry = CollectionEntry<'guides'>;

export type LatestItem = {
  kind: 'article' | 'experiment' | 'guide';
  title: string;
  summary: string;
  date: Date;
  href: string;
  tag: string;
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

export async function getPublishedExperiments(): Promise<Experiment[]> {
  const items = await getCollection('experiments', ({ data }) => data.draft !== true);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedGuides(): Promise<GuideEntry[]> {
  const items = await getCollection('guides', ({ data }) => data.draft !== true);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function articleHref(post: Article): string {
  return `/articles/${post.id}/`;
}

export function experimentHref(item: Experiment): string {
  return `/experiments/${item.id}/`;
}

/** Newest items across articles, experiments and guides. */
export async function getLatestItems(limit = 5): Promise<LatestItem[]> {
  const [articles, experiments, guides] = await Promise.all([
    getPublishedArticles(),
    getPublishedExperiments(),
    getPublishedGuides(),
  ]);

  const items: LatestItem[] = [
    ...articles.map((a) => ({
      kind: 'article' as const,
      title: a.data.title,
      summary: a.data.summary ?? a.data.description,
      date: a.data.date,
      href: articleHref(a),
      tag: 'Article',
    })),
    ...experiments.map((e) => ({
      kind: 'experiment' as const,
      title: e.data.title,
      summary: e.data.summary,
      date: e.data.date,
      href: experimentHref(e),
      tag: e.data.type,
    })),
    ...guides.map((g) => ({
      kind: 'guide' as const,
      title: g.data.title,
      summary: g.data.summary,
      date: g.data.date,
      href: g.data.href,
      tag: 'Guide',
    })),
  ];

  return items.sort((a, b) => b.date.valueOf() - a.date.valueOf()).slice(0, limit);
}
