/**
 * Terms used in experiment write-ups that a newcomer may not know.
 * `definition: null` renders as a visible TODO until the author fills it in.
 * The homepage links the first mention of each term on the page to its entry.
 */
export type GlossaryTerm = {
  id: string;
  term: string;
  /** Matched case-sensitively as a whole word when finding the first mention. */
  pattern: string;
  definition: string | null;
};

export const GLOSSARY: readonly GlossaryTerm[] = [
  {
    id: 'agents-md',
    term: 'AGENTS.md',
    pattern: 'AGENTS\\.md',
    definition:
      'A plain Markdown file in a repository, by convention read by coding agents before they start work. It holds instructions such as how to run the tests. (Draft wording, to be checked.)',
  },
  {
    id: 'codex',
    term: 'Codex',
    pattern: 'Codex',
    definition: 'OpenAI’s coding agent, used in many of these experiments. (Draft wording, to be checked.)',
  },
  { id: 'luna', term: 'Luna', pattern: 'Luna', definition: null },
  {
    id: 'qwen',
    term: 'Qwen',
    pattern: 'Qwen',
    definition:
      'A family of language models from Alibaba whose weights are published, so they can run on your own machine. (Draft wording, to be checked.)',
  },
  {
    id: 'strands',
    term: 'Strands',
    pattern: 'Strands',
    definition:
      'Strands Agents, an open-source toolkit for building AI agents in code, used here to build the security specialists and teams. (Draft wording, to be checked.)',
  },
  { id: 'swarm', term: 'Swarm', pattern: 'Swarm', definition: null },
];
