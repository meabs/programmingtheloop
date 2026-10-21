import rss from '@astrojs/rss';
import { getPublishedNews, newsHref } from '../../lib/collections';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '../../site';

/** Empty until ≥1 published news post exists. */
export async function GET(context) {
  const posts = await getPublishedNews();
  return rss({
    title: `${SITE_NAME} — News`,
    description: 'Weekday GenAI and coding-agent release roundups.',
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: newsHref(post),
    })),
    customData: `<language>en-GB</language>`,
  });
}
