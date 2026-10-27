/**
 * Shared topic tags for experiments (and later practices / articles).
 * Descriptions are one-liners drawn from Guide chapter openings — not new claims.
 */
export const TOPICS = {
  context: {
    title: 'Context',
    description:
      'The right facts, not every fact: context, documentation and knowledge layers.',
  },
  briefs: {
    title: 'Briefs',
    description: 'Briefs, plans and specifications: deciding what "done" means.',
  },
  verification: {
    title: 'Verification',
    description: 'Checking that a change works: executable checks and independent review.',
  },
  harness: {
    title: 'Harness',
    description: 'The harness and the friction loop: fixing recurring environment problems.',
  },
  parallel: {
    title: 'Parallel',
    description: 'Parallel agents: isolation and the cost of coordination.',
  },
  skills: {
    title: 'Skills',
    description: 'Agent skills and instruction files: what they change, and what they do not.',
  },
  review: {
    title: 'Review',
    description: 'Review, merging and risk: matching scrutiny to consequence.',
  },
  measurement: {
    title: 'Measurement',
    description: 'Tools and honest measurement: repeated runs with stated limits.',
  },
  'safety-cost': {
    title: 'Safety and cost',
    description: 'Safety, cost and the human in the loop.',
  },
} as const;

export type TopicId = keyof typeof TOPICS;

export const TOPIC_IDS = Object.keys(TOPICS) as TopicId[];

export function isTopicId(value: string): value is TopicId {
  return value in TOPICS;
}
