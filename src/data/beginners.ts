/**
 * The quiet "new to this?" route (/new-to-this/). Keep it short, two or three pieces in reading order,
 * and keep it out of the main nav and the hero. The titles and reading times come from the posts.
 */
export type BeginnerStep = {
  collection: 'articles' | 'architecture';
  /** The post's id (its file name without .md). A wrong id fails the build. */
  id: string;
  /** Why this one, in a sentence. */
  why: string;
};

export const BEGINNER_TRACK: BeginnerStep[] = [
  {
    collection: 'articles',
    id: 'how-genai-works',
    why: 'What happens between pressing Enter and words appearing, with every number measured on a small model on my desk. Start here if you have never looked under the bonnet.',
  },
  {
    collection: 'architecture',
    id: 'do-you-need-an-agent',
    why: 'Once you know how the loop works, the practical question: plain code, one model call, a workflow or an agent? The same shop built four ways and tested.',
  },
];

/** Where to go afterwards. Plain links, no numbers. */
export const BEGINNER_NEXT: { label: string; href: string; why: string }[] = [
  { label: 'What the experiments show', href: '/findings/', why: 'The results, grouped by the problem you are trying to solve, each with its limits.' },
  { label: 'Where to start in the Guide', href: '/guides/programming-the-loop/start/', why: 'Pick the situation that sounds like yours and it points you to a chapter.' },
  { label: 'Glossary', href: '/guides/programming-the-loop/glossary/', why: 'The terms in plain English.' },
];
