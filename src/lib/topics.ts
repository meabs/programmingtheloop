import { TOPICS, isTopicId, type TopicId } from '../data/topics';
import { getPublishedExperiments, type Experiment } from './collections';

export type TopicFinding = { f: NonNullable<Experiment['data']['findings']>[number]; e: Experiment };

export type TopicWithContent = {
  id: TopicId;
  title: string;
  description: string;
  experiments: Experiment[];
  /** Current findings of this topic's experiments. */
  findings: TopicFinding[];
};

/** Only topics that have published content get a page, so the set grows with the publication. */
export async function getTopicsWithContent(): Promise<TopicWithContent[]> {
  const experiments = await getPublishedExperiments();
  const byTopic = new Map<TopicId, Experiment[]>();
  for (const e of experiments) {
    for (const t of e.data.topics ?? []) {
      if (!isTopicId(t)) continue;
      byTopic.set(t, [...(byTopic.get(t) ?? []), e]);
    }
  }
  return [...byTopic]
    .map(([id, list]) => ({
      id,
      title: TOPICS[id].title,
      description: TOPICS[id].description,
      experiments: list,
      // Measurement is a method tag on most experiments: list only those with no other topic,
      // otherwise it would repeat nearly every finding.
      findings: list
        .filter((e) => id !== 'measurement' || (e.data.topics ?? []).every((x) => x === 'measurement'))
        .flatMap((e) => (e.data.findings ?? []).filter((f) => f.status !== 'superseded').map((f) => ({ f, e }))),
    }))
    .sort((a, b) => b.experiments.length - a.experiments.length || a.title.localeCompare(b.title));
}
