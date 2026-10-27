import rss from '@astrojs/rss';
import { getPublishedArchitecture, architectureHref } from '../../lib/collections';
import { SITE_URL, SITE_NAME } from '../../site';

export async function GET(context) {
  const posts = await getPublishedArchitecture();
  return rss({
    title: `${SITE_NAME} — Architecture`,
    description: 'Notes and experiments on how systems fit together, mostly from my own hobby projects.',
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary ?? post.data.description,
      pubDate: post.data.date,
      link: architectureHref(post),
    })),
    customData: `<language>en-GB</language>`,
  });
}
