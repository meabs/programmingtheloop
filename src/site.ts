/** Shared site constants — keep URLs absolute for SEO / social tags. */
export const SITE_URL = 'https://programmingtheloop.com';
export const SITE_NAME = 'Programming the Loop';
export const SITE_AUTHOR = 'Garry Meaburn';
export const SITE_DESCRIPTION =
  'Garry Meaburn on agentic build engineering: the living web edition of Programming the Loop, measurements and experiments, views on industry trends, and the archived first-edition PDF.';

/** Visible “last updated” for the living guide (ISO date). */
export const GUIDE_LAST_UPDATED = '2026-10-20';
export const GUIDE_LAST_UPDATED_LABEL = '20 October 2026';

/** Book-specific (use on book pages only). */
export const BOOK_TITLE = 'Programming the Loop';
export const BOOK_SUBTITLE = 'What I Measured with Coding Agents';
export const BOOK_EDITION = 'First edition, October 2026';
export const BOOK_DESCRIPTION =
  'Programming the Loop: What I Measured with Coding Agents — living web Guide by Garry Meaburn, from the October 2026 first edition. Small controlled trials on coding agents, with limits stated.';

export const PDF_PATH = '/downloads/Programming-the-Loop-1st-edition.pdf';
export const BOOK_OG_IMAGE = `${SITE_URL}/og-cover.png`;
export const SITE_OG_IMAGE = `${SITE_URL}/og-cover.png`;

/** Cloudflare Web Analytics — public site beacon token (cookie-free page views). */
export const CF_WEB_ANALYTICS_TOKEN = '0db0c13715df4bfda2115c9f12310d14';
export const CF_WEB_ANALYTICS_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';
/** Exact `data-cf-beacon` payload (spacing matches Cloudflare’s snippet). */
export const CF_WEB_ANALYTICS_BEACON = `{"token": "${CF_WEB_ANALYTICS_TOKEN}"}`;

/**
 * Main nav. Views is a core section (may be empty). Add Experiments when it has pages.
 */
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Guide', href: '/guide/' },
  { label: 'Views', href: '/views/' },
  { label: 'Updates', href: '/updates/' },
  { label: 'About', href: '/about/' },
] as const;

/** Chapter titles from the book; one-line notes drawn from each chapter’s opening. */
export const CHAPTERS = [
  {
    num: 1,
    title: 'Facts, checks and upkeep',
    subtitle: 'the argument and the evidence',
    blurb:
      'Terms, the evidence in outline, and the worked example the rest of the book follows.',
    href: '/guide/facts-checks-upkeep/',
  },
  {
    num: 2,
    title: 'Briefs, plans and specifications',
    subtitle: 'deciding what "done" means',
    blurb:
      'Decide what the change is, how you will know it is done, and what must not change, before an agent writes code.',
    href: '/guide/briefs-plans-specifications/',
  },
  {
    num: 3,
    title: 'The right facts, not every fact',
    subtitle: 'context, documentation and knowledge layers',
    blurb:
      'The main evidence chapter: generated context on a readable repository, stale dependency knowledge, and facts across a repository boundary.',
    href: '/guide/right-facts/',
  },
  {
    num: 4,
    title: 'One verifiable change at a time',
    subtitle: 'the implementation loop',
    blurb: 'Hand an agent one change you can verify at a time; the quality hangs on step size and the verify step.',
    href: '/guide/verifiable-change/',
  },
  {
    num: 5,
    title: 'Proof, not promises',
    subtitle: 'verification',
    blurb:
      'Executable checks and an independent judgement of the work, not only the agent’s account of it.',
    href: '/guide/proof-not-promises/',
  },
  {
    num: 6,
    title: 'The harness and the friction loop',
    subtitle: 'finding and removing recurring problems',
    blurb:
      'Agents trip on the same few environment problems; put fixes in the harness around them, not only in prompts.',
    href: '/guide/harness-friction-loop/',
  },
  {
    num: 7,
    title: 'Parallel agents',
    subtitle: 'isolation and the cost of coordination',
    blurb:
      'Deliberately short: none of my experiments measured parallel working as such, so this is judgement and other people’s published practice.',
    href: '/guide/parallel-agents/',
  },
  {
    num: 8,
    title: 'Review, merging and risk',
    subtitle: 'matching scrutiny to consequence',
    blurb:
      'Review by the consequence of being wrong: reversibility, blast radius and verification strength.',
    href: '/guide/review-merging-risk/',
  },
  {
    num: 9,
    title: 'Tools and honest measurement',
    subtitle: '',
    blurb:
      'Prefer boring tools with clear errors, and measure set-up changes with repeated runs rather than single anecdotes.',
    href: '/guide/tools-measurement/',
  },
  {
    num: 10,
    title: 'Safety, cost and the human in the loop',
    subtitle: '',
    blurb:
      'Security, cost and skills; keeps general practice apart from what I measured in the earlier trials.',
    href: '/guide/safety-cost-human/',
  },
  {
    num: 11,
    title: 'The take-home kit',
    subtitle: 'adopting agents, one justified layer at a time',
    blurb:
      'Start with a short AGENTS.md, runnable checks and contracts for unread dependencies; add each further layer only when it has earned its keep.',
    href: '/guide/take-home-kit/',
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

/**
 * Licence for the free PDF on this site (PDF download only).
 * Adapted from the book’s copyright notice; EPUB omitted because this site does not offer EPUB.
 */
export const LICENCE_SHORT =
  '© Garry Meaburn 2026. This guide is free to read. You may share the unchanged pages (or the archived first-edition PDF) with others, free of charge, as long as you credit Garry Meaburn as the author and keep the copyright notice. You may not sell it, use it commercially, or share modified versions, without written permission.';
