import rss from '@astrojs/rss';
import { getPublishedExperiments, experimentHref } from '../../lib/collections';
import { SITE_URL, SITE_NAME } from '../../site';

export async function GET(context) {
  const items = await getPublishedExperiments();
  return rss({
    title: `${SITE_NAME} — Experiments`,
    description: 'Controlled trials and worked examples on coding agents, with limits stated.',
    site: context.site ?? SITE_URL,
    items: items.map((item) => ({
      title: item.data.title,
      description: item.data.summary ?? item.data.description,
      pubDate: item.data.publishedOn ?? item.data.date,
      link: experimentHref(item),
    })),
    customData: `<language>en-GB</language>`,
  });
}
