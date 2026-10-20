/** Shared site constants — keep URLs absolute for SEO / social tags. */
export const SITE_URL = 'https://programmingtheloop.com';
export const SITE_NAME = 'Programming the Loop';
export const SITE_TAGLINE = 'Agentic engineering';
export const SITE_AUTHOR = 'Garry Meaburn';
export const SITE_DESCRIPTION =
  'Garry Meaburn on agentic engineering: working with coding agents — practices, measurements, experiments and notes.';

/** Book-specific (use on book pages only). */
export const BOOK_TITLE = 'Programming the Loop';
export const BOOK_SUBTITLE = 'What I Measured with Coding Agents';
export const BOOK_EDITION = 'First edition, October 2026';
export const BOOK_DESCRIPTION =
  'Programming the Loop: What I Measured with Coding Agents — a free ebook by Garry Meaburn on coding agents, context, verification and measured experiments. First edition, October 2026.';

export const PDF_PATH = '/downloads/Programming-the-Loop-1st-edition.pdf';
export const BOOK_OG_IMAGE = `${SITE_URL}/og-cover.png`;
/** Site-level social image (same cover for now; book pages set this explicitly too). */
export const SITE_OG_IMAGE = `${SITE_URL}/og-cover.png`;

/**
 * Main nav: only sections that currently have real content.
 * Add Notes / Experiments / Updates here when they have published pages.
 * Folders under src/content/docs/ already exist for those sections.
 */
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Book', href: '/book/' },
  { label: 'About', href: '/about/' },
] as const;

export const CHAPTERS = [
  {
    num: 1,
    title: 'Facts, checks and upkeep',
    subtitle: 'the argument and the evidence',
    href: '/learn/facts-checks-upkeep/',
  },
  {
    num: 2,
    title: 'Briefs, plans and specifications',
    subtitle: 'deciding what "done" means',
    href: '/learn/briefs-plans-specifications/',
  },
  {
    num: 3,
    title: 'The right facts, not every fact',
    subtitle: 'context, documentation and knowledge layers',
    href: '/learn/right-facts/',
  },
  {
    num: 4,
    title: 'One verifiable change at a time',
    subtitle: 'the implementation loop',
    href: '/learn/verifiable-change/',
  },
  {
    num: 5,
    title: 'Proof, not promises',
    subtitle: 'verification',
    href: '/learn/proof-not-promises/',
  },
  {
    num: 6,
    title: 'The harness and the friction loop',
    subtitle: 'finding and removing recurring problems',
    href: '/learn/harness-friction-loop/',
  },
  {
    num: 7,
    title: 'Parallel agents',
    subtitle: 'isolation and the cost of coordination',
    href: '/learn/parallel-agents/',
  },
  {
    num: 8,
    title: 'Review, merging and risk',
    subtitle: 'matching scrutiny to consequence',
    href: '/learn/review-merging-risk/',
  },
  {
    num: 9,
    title: 'Tools and honest measurement',
    subtitle: '',
    href: '/learn/tools-measurement/',
  },
  {
    num: 10,
    title: 'Safety, cost and the human in the loop',
    subtitle: '',
    href: '/learn/safety-cost-human/',
  },
  {
    num: 11,
    title: 'The take-home kit',
    subtitle: 'adopting agents, one justified layer at a time',
    href: '/learn/take-home-kit/',
  },
] as const;

export const LINKS = {
  pdf: PDF_PATH,
  workedExample: 'https://github.com/meabs/ProgrammingTheLoop-WorkedExample',
  feedbackIssue: 'https://github.com/meabs/ProgrammingTheLoop-WorkedExample/issues/new/choose',
  githubSite: 'https://github.com/meabs/programmingtheloop',
  githubAuthor: 'https://github.com/meabs',
  x: 'https://x.com/Mav1972',
  youtube: 'https://www.youtube.com/@FrugalAIEngineer',
} as const;

/** Licence for the free PDF, as stated for this site (PDF download only). */
export const LICENCE_SHORT =
  '© Garry Meaburn 2026. This ebook is free to read. You may share the unchanged PDF with others, free of charge, as long as you credit Garry Meaburn as the author and keep the copyright notice. You may not sell it, use it commercially, or share modified versions, without written permission.';
