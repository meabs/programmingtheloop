import rss from '@astrojs/rss';
import { getPublishedArticles, articleHref } from '../../lib/collections';
import { SITE_URL, SITE_NAME } from '../../site';

export async function GET(context) {
  const posts = await getPublishedArticles();
  return rss({
    title: `${SITE_NAME} — Articles`,
    description: 'Technical opinions, analysis and commentary by Garry Meaburn.',
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? post.data.description,
      pubDate: post.data.date,
      link: articleHref(post),
    })),
    customData: `<language>en-GB</language>`,
  });
}
