import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = 'https://programmingtheloop.com';
const ogImage = `${site}/og-cover.png`;

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Programming the Loop',
      description:
        'Programming the Loop: What I Measured with Coding Agents — a free ebook by Garry Meaburn. First edition, October 2026.',
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
      ],
      customCss: ['./src/styles/starlight.css'],
      sidebar: [
        {
          label: 'The book',
          items: [
            { label: 'Home', link: '/' },
            { label: 'Contents', link: '/contents/' },
            { label: 'Download PDF', link: '/downloads/' },
          ],
        },
        {
          label: 'Chapters',
          collapsed: false,
          items: [
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
          label: 'Site sections',
          items: [
            { label: 'Notes', link: '/notes/' },
            { label: 'Experiments', link: '/experiments/' },
            { label: 'Updates', link: '/updates/' },
            { label: 'About', link: '/about/' },
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
