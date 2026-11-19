/**
 * Editorial selection for the findings page and home. Every number shown comes from the finding
 * records by id; the questions and one-sentence readings here are wording, not measurements.
 * A wrong id fails the build.
 */
export type Pick = { id: string; question: string };

/** The three results to read first. */
export const STRONGEST: Pick[] = [
  { id: 'SWT-1', question: 'Does a team of agents beat one agent?' },
  { id: 'SEC-1', question: 'Is code that works also secure?' },
  { id: 'EM-1', question: 'Can false evidence mislead a security agent?' },
];

export type SynthesisGroup = {
  id: string;
  problem: string;
  /** My reading in one or two sentences, without numbers. Stays within what the listed findings show. */
  reading: string;
  ids: string[];
};

export const SYNTHESIS: SynthesisGroup[] = [
  {
    id: 'context',
    problem: 'When does extra context help an agent?',
    reading:
      'In these trials, supplying facts the agent could not otherwise see made the difference. Extra set-up for facts it could already read mostly added cost.',
    ids: ['D1-1', 'OKF-2', 'OKL-2', 'J-1', 'A-1'],
  },
  {
    id: 'wrong-facts',
    problem: 'What happens when the facts are out of date or wrong?',
    reading:
      'Agents repeated out-of-date and planted facts with confidence. One sentence telling the agent to confirm in source helped with drift.',
    ids: ['OKF-1', 'B3-1', 'E-1', 'RAG-1', 'RAG-2'],
  },
  {
    id: 'teams',
    problem: 'Do teams of agents beat one agent?',
    reading:
      'Not in these trials. A team did worse until every member had the full task, and then only matched one agent.',
    ids: ['SWT-1', 'SWT-2', 'SPS-1', 'SPS-2'],
  },
  {
    id: 'self-reports',
    problem: 'Can you trust an agent, or an AI reviewer, on whether the work is right?',
    reading:
      'Agents usually said the change worked when it had failed, and agent reviewers approved failing work. Check with something the agent does not control.',
    ids: ['SKT-3', 'SEC-5', 'SWT-3', 'SPS-3', 'DJ-1', 'DJ-4'],
  },
  {
    id: 'skills',
    problem: 'Do skills and instructions change what the agent does?',
    reading:
      'Reading a skill is not the same as acting on it, and telling the agent to use skills mostly did not raise the pass rate. A specific instruction did change what the agent did. In VVS, more reasoning effort did more than the skills.',
    ids: ['ESK-1', 'ESK-2', 'SKT-1', 'RSK-1', 'TSK-1', 'VVS-1'],
  },
  {
    id: 'security',
    problem: 'Is an agent secure when it works?',
    reading:
      'Working and secure were different things. In EM, a false fact was a stronger attack than a blunt injected instruction, and a check against an authoritative record helped.',
    ids: ['SEC-1', 'SEC-4', 'EM-1', 'EM-2', 'EM-4'],
  },
];
