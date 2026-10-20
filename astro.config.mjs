import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://programmingtheloop.com',
  integrations: [starlight({
    title: 'Programming the Loop',
    description: 'Evidence-led engineering for coding agents.',
    favicon: '/favicon.svg',
    head: [
      { tag: 'meta', attrs: { property: 'og:image', content: 'https://programmingtheloop.com/social-card.svg' } },
      { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://programmingtheloop.com/social-card.svg' } },
    ],
    customCss: ['./src/styles/starlight.css'],
    sidebar: [
      { label: 'Start here', items: [{ label: 'Learning paths', link: '/learn/' }, { label: 'Getting started', link: '/learn/getting-started/' }] },
      { label: 'The book, online', collapsed: true, items: [
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
        { label: '11. The take-home kit', link: '/learn/take-home-kit/' }
      ] },
      { label: 'Experiments', items: [{ label: 'Research index', link: '/experiments/' }, { label: 'Knowing When You Don’t Know · planned', link: '/experiments/knowing-when-you-dont-know/' }] },
      { label: 'Resources', items: [{ label: 'Ebook', link: '/resources/ebook/' }, { label: 'Evidence and method', link: '/about/methodology/' }] }
    ],
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/meabs/programmingtheloop' }],
    editLink: { baseUrl: 'https://github.com/meabs/programmingtheloop/edit/main/' },
    lastUpdated: true,
    disable404Route: true,
  })],
});
