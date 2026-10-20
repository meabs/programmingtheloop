import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import {
  CF_WEB_ANALYTICS_SRC,
  CF_WEB_ANALYTICS_BEACON,
} from './src/site.ts';

const site = 'https://programmingtheloop.com';
const ogImage = `${site}/og-cover.png`;

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Programming the Loop',
      description:
        "Building software with coding agents. What I've measured, what I think, and the full Programming the Loop guide, free to read.",
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
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: ogImage },
        },
        {
          tag: 'link',
          attrs: { rel: 'icon', href: '/favicon.png', type: 'image/png' },
        },
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
          items: [
            { label: 'Home', link: '/' },
            { label: 'Views', link: '/views/' },
            { label: 'Guide', link: '/guide/' },
            { label: 'Updates', link: '/updates/' },
            { label: 'About', link: '/about/' },
          ],
        },
        {
          label: 'Guide',
          collapsed: false,
          items: [
            { label: 'Contents', link: '/guide/' },
            { label: 'Foreword', link: '/guide/foreword/' },
            { label: '1. Facts, checks and upkeep', link: '/guide/facts-checks-upkeep/' },
            { label: '2. Briefs, plans and specifications', link: '/guide/briefs-plans-specifications/' },
            { label: '3. The right facts, not every fact', link: '/guide/right-facts/' },
            { label: '4. One verifiable change at a time', link: '/guide/verifiable-change/' },
            { label: '5. Proof, not promises', link: '/guide/proof-not-promises/' },
            { label: '6. The harness and the friction loop', link: '/guide/harness-friction-loop/' },
            { label: '7. Parallel agents', link: '/guide/parallel-agents/' },
            { label: '8. Review, merging and risk', link: '/guide/review-merging-risk/' },
            { label: '9. Tools and honest measurement', link: '/guide/tools-measurement/' },
            { label: '10. Safety, cost and the human', link: '/guide/safety-cost-human/' },
            { label: '11. The take-home kit', link: '/guide/take-home-kit/' },
            { label: 'Cheat sheet', link: '/guide/cheat-sheet/' },
            { label: 'Glossary', link: '/guide/glossary/' },
            { label: 'References', link: '/guide/references/' },
            { label: 'About the evidence', link: '/guide/about-the-evidence/' },
            { label: 'About the author', link: '/guide/about-the-author/' },
            { label: 'Acknowledgements', link: '/guide/acknowledgements/' },
          ],
        },
        {
          label: 'PDF',
          collapsed: true,
          items: [
            { label: 'October 2026 PDF', link: '/downloads/' },
            { label: 'Book landing', link: '/book/' },
          ],
        },
        {
          label: 'Start',
          collapsed: true,
          items: [{ label: 'Where to begin', link: '/start/' }],
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
      ],
      editLink: {
        baseUrl: 'https://github.com/meabs/programmingtheloop/edit/main/',
      },
      lastUpdated: true,
      disable404Route: true,
    }),
  ],
});
