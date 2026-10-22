/** Shared site constants — keep URLs absolute for SEO / social tags. */
export const SITE_URL = 'https://programmingtheloop.com';
export const SITE_NAME = 'Programming the Loop';
export const SITE_AUTHOR = 'Garry Meaburn';
export const SITE_DESCRIPTION =
  "Practical thinking on AI, software engineering, architecture and the tools we build with. Experiments, projects and guides.";

/** Base path for the Programming the Loop multi-page guide. */
export const PTL_GUIDE_HREF = '/guides/programming-the-loop/';

/** Visible “last updated” for the Guide (ISO date). */
export const GUIDE_LAST_UPDATED = '2026-10-20';
export const GUIDE_LAST_UPDATED_LABEL = '20 October 2026';

/** Book-specific (use on book pages only). */
export const BOOK_TITLE = 'Programming the Loop';
export const BOOK_SUBTITLE = 'What I Measured with Coding Agents';
export const BOOK_EDITION = 'First edition, October 2026';
export const BOOK_DESCRIPTION =
  'Programming the Loop: What I Measured with Coding Agents by Garry Meaburn. Free to read on the web. Small controlled trials on coding agents, with limits stated.';

export const PDF_PATH = '/downloads/Programming-the-Loop-1st-edition.pdf';
/** Default link-preview image (1200×630 typographic, light theme). */
export const SITE_OG_IMAGE = `${SITE_URL}/og/default.png`;
export const SITE_OG_IMAGE_ALT =
  'Programming the Loop — Building software with coding agents.';
/** @deprecated Use SITE_OG_IMAGE; kept as an alias so older imports keep working. */
export const BOOK_OG_IMAGE = SITE_OG_IMAGE;

/** Cloudflare Web Analytics — public site beacon token (cookie-free page views). */
export const CF_WEB_ANALYTICS_TOKEN = '0db0c13715df4bfda2115c9f12310d14';
export const CF_WEB_ANALYTICS_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';
/** Exact `data-cf-beacon` payload (spacing matches Cloudflare’s snippet). */
export const CF_WEB_ANALYTICS_BEACON = `{"token": "${CF_WEB_ANALYTICS_TOKEN}"}`;

/**
 * Minimum published items before a collection-gated nav section appears.
 * Home and About always show. Guides uses minItems: 1 (book hub).
 * Articles / Experiments / News use NAV_MIN_ITEMS.
 */
export const NAV_MIN_ITEMS = 1;

export type NavCollection = 'articles' | 'experiments' | 'guides' | 'news';

export type NavItem = {
  num: string;
  label: string;
  href: string;
  /** Always shown regardless of counts. */
  always?: boolean;
  /** Gate on published count for this collection. */
  collection?: NavCollection;
  /** Override NAV_MIN_ITEMS for this item (e.g. Guides: 1). */
  minItems?: number;
};

/**
 * Main nav — numbered like an engineering index.
 * Updates lives in the footer only.
 * Collection sections are filtered + renumbered via nav-gate (getVisibleNav /
 * siteSidebarItems). Static `num` values here are source-order only.
 */
export const NAV: readonly NavItem[] = [
  { num: '00', label: 'Home', href: '/', always: true },
  // Each section appears with its first published item.
  { num: '01', label: 'Articles', href: '/articles/', collection: 'articles' },
  { num: '02', label: 'News', href: '/news/', collection: 'news' },
  { num: '03', label: 'Experiments', href: '/experiments/', collection: 'experiments' },
  // Book hub: show once at least one guide is published.
  { num: '04', label: 'Guides', href: '/guides/', collection: 'guides', minItems: 1 },
  { num: '05', label: 'About', href: '/about/', always: true },
];

/**
 * Measured finding numbers live on experiment `findings[]` records
 * (`src/lib/findings.ts`). Structural Guide counts (chapters / checklists /
 * figures) are computed in `src/lib/guide-counts.ts`. Do not reintroduce
 * SITE_STATS / FINDING_DASHBOARD / SYSTEM_STATUS hard-coded chrome.
 */

/** Ticker topics drawn from Guide chapter titles / thesis — not marketing fluff. */
export const TOPIC_TICKER = [
  'Briefs',
  'Context',
  'Verification',
  'Harness',
  'Friction loop',
  'Contracts',
  'Freshness gates',
  'Review tiers',
  'Honest measurement',
  'Human in the loop',
  'Take-home kit',
  'Right facts, not every fact',
] as const;

/**
 * Where to start: reader situation → Guide entry → where it leads.
 * Situations and destinations follow the book’s own reading advice and chapter jobs.
 * `then` is plain text and/or chapter links (strings | { label, href }).
 */
export type StartThenPart = string | { label: string; href: string };

export const START_ROUTES: ReadonlyArray<{
  have: string;
  startWith: { label: string; href: string; detail: string };
  then: ReadonlyArray<StartThenPart>;
  chips: ReadonlyArray<string>;
  accent: 'teal' | 'rose' | 'blue' | 'green' | 'orange';
}> = [
  {
    have: 'Twenty minutes and want the heart of the argument',
    startWith: {
      label: 'Chapter 3',
      href: '/guides/programming-the-loop/right-facts/',
      detail: 'The right facts, not every fact',
    },
    then: [
      { label: 'Chapter 5', href: '/guides/programming-the-loop/proof-not-promises/' },
      ' and the ',
      { label: 'take-home kit (Ch. 11)', href: '/guides/programming-the-loop/take-home-kit/' },
    ],
    chips: ['20 minutes', 'Ch. 3'],
    accent: 'teal',
  },
  {
    have: 'An agent about to get production credentials',
    startWith: {
      label: 'Chapter 10',
      href: '/guides/programming-the-loop/safety-cost-human/',
      detail: 'Safety, cost and the human in the loop',
    },
    then: [
      { label: 'Harness', href: '/guides/programming-the-loop/harness-friction-loop/' },
      ' and ',
      { label: 'review', href: '/guides/programming-the-loop/review-merging-risk/' },
      ' habits before you widen access',
    ],
    chips: ['read first', 'credentials'],
    accent: 'rose',
  },
  {
    have: 'Agents burning tokens on context I already have in source',
    startWith: {
      label: 'Chapter 3',
      href: '/guides/programming-the-loop/right-facts/',
      detail: 'Finding 1 — optimised repo cost',
    },
    then: [
      'Lean AGENTS.md; add layers only when they pay — see the ',
      { label: 'take-home kit', href: '/guides/programming-the-loop/take-home-kit/' },
    ],
    chips: ['+35–48%', 'tokens'],
    accent: 'blue',
  },
  {
    have: 'Changes that depend on a repository the agent cannot read',
    startWith: {
      label: 'Chapter 3',
      href: '/guides/programming-the-loop/right-facts/',
      detail: 'Findings 2–3 — facts across a boundary',
    },
    then: [
      'Contracts and freshness gates in ',
      { label: 'Chapter 5', href: '/guides/programming-the-loop/proof-not-promises/' },
    ],
    chips: ['3 → 18–19/20'],
    accent: 'green',
  },
  {
    have: 'No clear “done” before the agent starts writing',
    startWith: {
      label: 'Chapter 2',
      href: '/guides/programming-the-loop/briefs-plans-specifications/',
      detail: 'Briefs, plans and specifications',
    },
    then: [
      {
        label: 'One verifiable change at a time (Ch. 4)',
        href: '/guides/programming-the-loop/verifiable-change/',
      },
    ],
    chips: ['brief', 'acceptance'],
    accent: 'orange',
  },
  {
    have: 'Reports that say passed while the real check is unverified',
    startWith: {
      label: 'Chapter 5',
      href: '/guides/programming-the-loop/proof-not-promises/',
      detail: 'Proof, not promises',
    },
    then: [
      'Independent checks the agent cannot rewrite — stay in ',
      { label: 'Chapter 5', href: '/guides/programming-the-loop/proof-not-promises/' },
    ],
    chips: ['12 runs', 'freshness gate'],
    accent: 'rose',
  },
  {
    have: 'The same environment failures every agent session',
    startWith: {
      label: 'Chapter 6',
      href: '/guides/programming-the-loop/harness-friction-loop/',
      detail: 'The harness and the friction loop',
    },
    then: [
      'Fixes in the ',
      { label: 'harness', href: '/guides/programming-the-loop/harness-friction-loop/' },
      ', not only in prompts',
    ],
    chips: ['friction', 'script'],
    accent: 'teal',
  },
  {
    have: 'Need to match review depth to blast radius',
    startWith: {
      label: 'Chapter 8',
      href: '/guides/programming-the-loop/review-merging-risk/',
      detail: 'Review, merging and risk',
    },
    then: [
      'Tiered review from reversibility and verification strength — ',
      { label: 'Chapter 8', href: '/guides/programming-the-loop/review-merging-risk/' },
    ],
    chips: ['tiers', 'blast radius'],
    accent: 'blue',
  },
  {
    have: 'Wondering whether a set-up change actually helped',
    startWith: {
      label: 'Chapter 9',
      href: '/guides/programming-the-loop/tools-measurement/',
      detail: 'Tools and honest measurement',
    },
    then: [
      'Repeated runs with stated limits — ',
      { label: 'Chapter 9', href: '/guides/programming-the-loop/tools-measurement/' },
    ],
    chips: ['measure', 'limits'],
    accent: 'green',
  },
  {
    have: 'Ready to adopt — what do we put in place first',
    startWith: {
      label: 'Chapter 11',
      href: '/guides/programming-the-loop/take-home-kit/',
      detail: 'The take-home kit',
    },
    then: [
      'Default / Conditional / Experimental labels for each layer — ',
      { label: 'Chapter 11', href: '/guides/programming-the-loop/take-home-kit/' },
    ],
    chips: ['Stage 0', 'justify'],
    accent: 'orange',
  },
  {
    have: 'Want the findings and thesis before any chapter',
    startWith: {
      label: 'Foreword',
      href: '/guides/programming-the-loop/foreword/',
      detail: 'Why I ran the experiments',
    },
    then: [
      'Eleven chapters with checklists — from ',
      { label: 'Chapter 1', href: '/guides/programming-the-loop/facts-checks-upkeep/' },
      ' onward, or the ',
      { label: 'Guide contents', href: '/guides/programming-the-loop/' },
    ],
    chips: ['4 findings', 'thesis'],
    accent: 'teal',
  },
];

/** Chapter titles from the book; one-line notes drawn from each chapter’s opening. */
export const CHAPTERS = [
  {
    num: 1,
    title: 'Facts, checks and upkeep',
    subtitle: 'the argument and the evidence',
    blurb:
      'Terms, the evidence in outline, and the worked example the rest of the book follows.',
    href: '/guides/programming-the-loop/facts-checks-upkeep/',
  },
  {
    num: 2,
    title: 'Briefs, plans and specifications',
    subtitle: 'deciding what "done" means',
    blurb:
      'Decide what the change is, how you will know it is done, and what must not change, before an agent writes code.',
    href: '/guides/programming-the-loop/briefs-plans-specifications/',
  },
  {
    num: 3,
    title: 'The right facts, not every fact',
    subtitle: 'context, documentation and knowledge layers',
    blurb:
      'The main evidence chapter: generated context on a readable repository, stale dependency knowledge, and facts across a repository boundary.',
    href: '/guides/programming-the-loop/right-facts/',
  },
  {
    num: 4,
    title: 'One verifiable change at a time',
    subtitle: 'the implementation loop',
    blurb: 'Hand an agent one change you can verify at a time; the quality hangs on step size and the verify step.',
    href: '/guides/programming-the-loop/verifiable-change/',
  },
  {
    num: 5,
    title: 'Proof, not promises',
    subtitle: 'verification',
    blurb:
      'Executable checks and an independent judgement of the work, not only the agent’s account of it.',
    href: '/guides/programming-the-loop/proof-not-promises/',
  },
  {
    num: 6,
    title: 'The harness and the friction loop',
    subtitle: 'finding and removing recurring problems',
    blurb:
      'Agents trip on the same few environment problems; put fixes in the harness around them, not only in prompts.',
    href: '/guides/programming-the-loop/harness-friction-loop/',
  },
  {
    num: 7,
    title: 'Parallel agents',
    subtitle: 'isolation and the cost of coordination',
    blurb:
      'Deliberately short: none of my experiments measured parallel working as such, so this is judgement and other people’s published practice.',
    href: '/guides/programming-the-loop/parallel-agents/',
  },
  {
    num: 8,
    title: 'Review, merging and risk',
    subtitle: 'matching scrutiny to consequence',
    blurb:
      'Review by the consequence of being wrong: reversibility, blast radius and verification strength.',
    href: '/guides/programming-the-loop/review-merging-risk/',
  },
  {
    num: 9,
    title: 'Tools and honest measurement',
    subtitle: '',
    blurb:
      'Prefer boring tools with clear errors, and measure set-up changes with repeated runs rather than single anecdotes.',
    href: '/guides/programming-the-loop/tools-measurement/',
  },
  {
    num: 10,
    title: 'Safety, cost and the human in the loop',
    subtitle: '',
    blurb:
      'Security, cost and skills; keeps general practice apart from what I measured in the earlier trials.',
    href: '/guides/programming-the-loop/safety-cost-human/',
  },
  {
    num: 11,
    title: 'The take-home kit',
    subtitle: 'adopting agents, one justified layer at a time',
    blurb:
      'Start with a short AGENTS.md, runnable checks and contracts for unread dependencies; add each further layer only when it has earned its keep.',
    href: '/guides/programming-the-loop/take-home-kit/',
  },
] as const;

export const LINKS = {
  pdf: PDF_PATH,
  workedExample: 'https://github.com/meabs/ProgrammingTheLoop-WorkedExample',
  feedbackIssue: 'https://github.com/meabs/ProgrammingTheLoop-WorkedExample/issues/new/choose',
  githubSite: 'https://github.com/meabs/programmingtheloop',
  githubAuthor: 'https://github.com/meabs',
  x: 'https://x.com/Mav1972',
  linkedin: 'https://uk.linkedin.com/in/garrymeaburn',
  youtube: 'https://www.youtube.com/@FrugalAIEngineer',
} as const;

/**
 * Licence for the free web guide and October 2026 PDF.
 * Adapted from the book’s copyright notice; ebook / PDF-or-EPUB wording fitted for the web.
 */
export const LICENCE_SHORT =
  '© Garry Meaburn 2026. This guide is free to read. You may share the unchanged pages (or the October 2026 PDF) with others, free of charge, as long as you credit Garry Meaburn as the author and keep the copyright notice. You may not sell it, use it commercially, or share modified versions, without written permission.';

/** Copyright-page paragraph from the first edition (verbatim). */
export const LICENCE_QUOTED =
  'Quoted material belongs to its authors and is used briefly, with attribution and a link, for commentary. My software repositories carry their own licences, listed in "About the evidence"; they are not covered by the copyright line above.';

/** Copyright-page disclaimer from the first edition (verbatim). */
export const LICENCE_DISCLAIMER =
  'Disclaimer. Practical opinion, written in good faith, about tools that change month to month. Not legal, security or financial advice. My experiments are small and I say so each time. Test anything here on your own code before you rely on it, and keep backups: agents can and do delete things. The views in this book are the author\'s own and do not represent any employer, past or present.';

/** HTML forms for custom pages (bold lead-ins as in the book). */
export const LICENCE_QUOTED_HTML =
  '<strong>Quoted material</strong> belongs to its authors and is used briefly, with attribution and a link, for commentary. <strong>My software repositories</strong> carry their own licences, listed in "About the evidence"; they are not covered by the copyright line above.';

export const LICENCE_DISCLAIMER_HTML =
  '<strong>Disclaimer.</strong> Practical opinion, written in good faith, about tools that change month to month. Not legal, security or financial advice. My experiments are small and I say so each time. Test anything here on your own code before you rely on it, and keep backups: agents can and do delete things. The views in this book are the author\'s own and do not represent any employer, past or present.';
