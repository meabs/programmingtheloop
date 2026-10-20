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
        'Garry Meaburn on agentic build engineering: building software with coding agents, measurements, experiments, views on industry trends, and a free ebook.',
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
            { label: 'Book', link: '/book/' },
            { label: 'Experiments', link: '/experiments/' },
            { label: 'About', link: '/about/' },
          ],
        },
        {
          label: 'Learn',
          collapsed: false,
          items: [
            { label: 'Chapters', link: '/learn/' },
            { label: 'Getting started', link: '/learn/getting-started/' },
            { label: '1. Facts, checks and upkeep', link: '/learn/facts-checks-upkeep/' },
            { label: '2. Briefs, plans and specifications', link: '/learn/briefs-plans-specifications/' },
            { label: '3. The right facts, not every fact', link: '/learn/right-facts/' },
            { label: '4. One verifiable change at a time', link: '/learn/verifiable-change/' },
            { label: '5. Proof, not promises', link: '/learn/proof-not-promises/' },
            { label: '6. The harness and the friction loop', link: '/learn/harness-friction-loop/' },
            { label: '7. Parallel agents', link: '/learn/parallel-agents/' },
            { label: '8. Review, merging and risk', link: '/learn/review-merging-risk/' },
            { label: '9. Tools and honest measurement', link: '/learn/tools-measurement/' },
            { label: '10. Safety, cost and the human', link: '/learn/safety-cost-human/' },
            { label: '11. The take-home kit', link: '/learn/take-home-kit/' },
          ],
        },
        {
          label: 'Book',
          collapsed: true,
          items: [
            { label: 'Book overview', link: '/book/' },
            { label: 'Contents', link: '/contents/' },
            { label: 'Download PDF', link: '/downloads/' },
            { label: 'Experiment J', link: '/experiments/repository-optimisation/' },
          ],
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
