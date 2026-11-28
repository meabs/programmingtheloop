import type { TopicId } from './topics';

/**
 * Experiments I have not run yet. Each comes from a follow-up already written on a
 * published page ("What would be worth testing next?"). Not a commitment or a schedule:
 * when one is run it becomes an experiment page and leaves this list.
 */
export type NextExperiment = {
  title: string;
  question: string;
  /** Slug of the published experiment whose result prompts it. */
  from: string;
  fromLabel: string;
  topics: TopicId[];
};

export const NEXT_EXPERIMENTS: NextExperiment[] = [
  {
    title: 'When the source of truth is wrong',
    question:
      'EM used complete, correct authoritative records. What happens when the verification source is stale, missing, contradicts another source, or has been compromised?',
    from: 'evidence-manipulation',
    fromLabel: 'EM',
    topics: ['verification', 'safety-cost'],
  },
  {
    title: 'Propose, then execute',
    question:
      'If the agent can only propose an action and a deterministic gate decides what runs, do the stray action calls seen in EM disappear? Scored on what was executed, not the agent’s final answer.',
    from: 'evidence-manipulation',
    fromLabel: 'EM',
    topics: ['safety-cost', 'verification'],
  },
  {
    title: 'Subtler prompt injection',
    question:
      'EM tested one blunt instruction, which changed 0 of 120 decisions. Do injections that read like an ordinary ticket comment, or come from a more trusted source, do better?',
    from: 'evidence-manipulation',
    fromLabel: 'EM',
    topics: ['safety-cost'],
  },
  {
    title: 'Conflicting evidence and source provenance',
    question:
      'When two sources disagree, especially when the wrong one looks more authoritative, what does a retrieval agent do? Does telling it a source’s age, origin or reliability change the outcome?',
    from: 'poisoned-retrieval',
    fromLabel: 'RAG',
    topics: ['context', 'verification'],
  },
  {
    title: 'A split team with a build-and-start step',
    question:
      'In SPS, a split team passed 61.6% of hidden tests against 62.4% for one agent. Does that change when one agent starts the application and calls each new endpoint before review?',
    from: 'split-spec',
    fromLabel: 'SPS',
    topics: ['parallel', 'verification'],
  },
  {
    title: 'Teams that must write tests',
    question:
      'Does a coder told to add tests for the stated interface, with a reviewer who writes acceptance tests from the requirements before reading the change, recover what the split lost?',
    from: 'swarm-tax',
    fromLabel: 'SWT',
    topics: ['parallel', 'review'],
  },
  {
    title: 'A realistic way to choose between attempts',
    question:
      'SWT had a 68.9% upper bound if the best attempt could be picked. How close does a judge model get?',
    from: 'swarm-tax',
    fromLabel: 'SWT',
    topics: ['parallel', 'review'],
  },
];
