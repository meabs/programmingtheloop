import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import {
  CF_WEB_ANALYTICS_SRC,
  CF_WEB_ANALYTICS_BEACON,
  SITE_TWITTER,
} from './src/site.ts';
import {
  readNavCollectionCountsSync,
  siteSidebarItems,
} from './src/lib/nav-gate.ts';
import { RSS_FEEDS } from './src/lib/seo.ts';

const site = 'https://programmingtheloop.com';
const ogImage = `${site}/og/default.png`;
const ogImageAlt = 'Programming the Loop: Building software with coding agents';
const guideBase = '/guides/programming-the-loop';
const navCounts = readNavCollectionCountsSync();
const siteNavSidebar = siteSidebarItems(navCounts);
const rssAlternateHead = RSS_FEEDS.map((feed) => ({
  tag: 'link',
  attrs: {
    rel: 'alternate',
    type: 'application/rss+xml',
    title: feed.title,
    href: feed.href,
  },
}));

export default defineConfig({
  site,
  trailingSlash: 'always',
  redirects: {
    '/guide': `${guideBase}/`,
    '/guide/': `${guideBase}/`,
    '/start': `${guideBase}/start/`,
    '/start/': `${guideBase}/start/`,
    '/views': '/articles/',
    '/views/': '/articles/',
    '/articles/webmcp-sharing-the-browser': '/architecture/webmcp-sharing-the-browser/',
    '/articles/webmcp-sharing-the-browser/': '/architecture/webmcp-sharing-the-browser/',
    '/book': `${guideBase}/`,
    '/book/': `${guideBase}/`,
    '/contents': `${guideBase}/`,
    '/contents/': `${guideBase}/`,
  },
  integrations: [
    // Register before Starlight so Starlight does not add a second sitemap integration.
    sitemap({
      filter: (page) => {
        if (page.includes('/search')) return false;
        // Legacy /guide/<chapter>/ URLs only redirect to /guides/…; keep them out of the sitemap.
        if (/\/guide\//.test(page)) return false;
        // Hide empty collection sections until something is published.
        if (navCounts.articles < 1 && /\/articles(\/|$)/.test(page)) return false;
        if (navCounts.architecture < 1 && /\/architecture(\/|$)/.test(page)) return false;
        return true;
      },
    }),
    starlight({
      title: 'Programming the Loop',
      description:
        'Practical thinking on AI, software engineering, architecture and the tools we build with.',
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: ogImage },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:width', content: '1200' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:height', content: '630' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:alt', content: ogImageAlt },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:site', content: SITE_TWITTER },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:creator', content: SITE_TWITTER },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: ogImage },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', href: '/favicon.png', type: 'image/png' },
        },
        ...rssAlternateHead,
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: CF_WEB_ANALYTICS_SRC,
            'data-cf-beacon': CF_WEB_ANALYTICS_BEACON,
          },
        },
      ],
      customCss: ['./src/styles/starlight.css'],
      sidebar: [
        {
          label: 'Site',
          items: siteNavSidebar,
        },
        {
          label: 'Programming the Loop',
          collapsed: false,
          items: [
            { label: 'Guide home', link: `${guideBase}/` },
            { label: 'Where to start', link: `${guideBase}/start/` },
            { label: 'Foreword', link: `${guideBase}/foreword/` },
            { label: '1. Facts, checks and upkeep', link: `${guideBase}/facts-checks-upkeep/` },
            { label: '2. Briefs, plans and specifications', link: `${guideBase}/briefs-plans-specifications/` },
            { label: '3. The right facts, not every fact', link: `${guideBase}/right-facts/` },
            { label: '4. One verifiable change at a time', link: `${guideBase}/verifiable-change/` },
            { label: '5. Proof, not promises', link: `${guideBase}/proof-not-promises/` },
            { label: '6. The harness and the friction loop', link: `${guideBase}/harness-friction-loop/` },
            { label: '7. Parallel agents', link: `${guideBase}/parallel-agents/` },
            { label: '8. Review, merging and risk', link: `${guideBase}/review-merging-risk/` },
            { label: '9. Tools and honest measurement', link: `${guideBase}/tools-measurement/` },
            { label: '10. Safety, cost and the human', link: `${guideBase}/safety-cost-human/` },
            { label: '11. The take-home kit', link: `${guideBase}/take-home-kit/` },
            { label: 'Cheat sheet', link: `${guideBase}/cheat-sheet/` },
            { label: 'Glossary', link: `${guideBase}/glossary/` },
            { label: 'References', link: `${guideBase}/references/` },
            { label: 'About the evidence', link: `${guideBase}/about-the-evidence/` },
            { label: 'About the author', link: `${guideBase}/about-the-author/` },
            { label: 'Acknowledgements', link: `${guideBase}/acknowledgements/` },
          ],
        },
        {
          label: 'PDF',
          collapsed: true,
          items: [{ label: 'October 2026 PDF', link: '/downloads/' }],
        },
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/meabs/programmingtheloop',
        },
        {
          icon: 'x.com',
          label: 'X',
          href: 'https://x.com/Mav1972',
        },
        {
          icon: 'linkedin',
          label: 'LinkedIn',
          href: 'https://uk.linkedin.com/in/garrymeaburn',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/meabs/programmingtheloop/edit/main/',
      },
      lastUpdated: true,
      disable404Route: true,
    }),
  ],
});
