import { getCollection, type CollectionEntry } from 'astro:content';

export type ViewPost = CollectionEntry<'views'>;

/** Published views only, newest first. */
export async function getPublishedViews(): Promise<ViewPost[]> {
  const posts = await getCollection('views', ({ data }) => data.draft !== true);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function viewHref(post: ViewPost): string {
  return `/views/${post.id}/`;
}

export function formatViewDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
