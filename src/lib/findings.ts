/**
 * Finding records live on experiment entries. UI chrome reads them here —
 * never restate measured numbers in site.ts constants.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { getGuideStructureCounts } from './guide-counts';

export type Experiment = CollectionEntry<'experiments'>;
export type Finding = NonNullable<Experiment['data']['findings']>[number];

export type FindingWithExperiment = Finding & {
  experimentId: string;
  experimentTitle: string;
  experimentHref: string;
};

export async function getPublishedExperimentsWithFindings(): Promise<Experiment[]> {
  const items = await getCollection('experiments', ({ data }) => data.draft !== true);
  return items.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** All current findings across published experiments. */
export async function getCurrentFindings(): Promise<FindingWithExperiment[]> {
  const experiments = await getPublishedExperimentsWithFindings();
  const out: FindingWithExperiment[] = [];
  for (const exp of experiments) {
    const expId = exp.data.experimentId ?? exp.id;
    for (const f of exp.data.findings ?? []) {
      if (f.status === 'superseded') continue;
      out.push({
        ...f,
        experimentId: expId,
        experimentTitle: exp.data.title,
        experimentHref: `/experiments/${exp.id}/`,
      });
    }
  }
  return out;
}

/** Featured current findings (homepage / guide landing headlines). */
export async function getFeaturedFindings(): Promise<FindingWithExperiment[]> {
  const all = await getCurrentFindings();
  return all
    .filter((f) => f.featured)
    .sort((a, b) => a.id.localeCompare(b.id, 'en'));
}

/**
 * Guide landing “At a glance” strip.
 * Structural counts from the guide tree; headline/runs from experiment records.
 */
export async function getGuideLandingStats(): Promise<
  { key: string; value: string; caption: string }[]
> {
  const structure = getGuideStructureCounts();
  const experiments = await getPublishedExperimentsWithFindings();
  const featured = await getFeaturedFindings();

  const okf = experiments.find((e) => e.data.experimentId === 'OKF' || e.id === 'okf-worked-example');
  const runs =
    okf?.data.runs !== undefined && okf.data.runs !== null
      ? String(okf.data.runs)
      : '';

  return [
    {
      key: 'Chapters',
      value: String(structure.chapters),
      caption: 'In this guide',
    },
    {
      key: 'Checklist items',
      value: String(structure.checklistItems),
      caption: `Across ${structure.chapters} chapter checklists`,
    },
    {
      key: 'Figures',
      value: String(structure.figures),
      caption: 'Charts and diagrams',
    },
    {
      key: 'Headline findings',
      value: String(featured.length),
      caption: 'Foreword, with limits',
    },
    ...(runs
      ? [
          {
            key: 'Controlled runs',
            value: runs,
            caption: 'OKFExperiment repo',
          },
        ]
      : []),
  ];
}

/** Short label for dashboard / foreword list lines. */
export function findingDisplayValue(f: Finding): string {
  return f.value?.trim() || f.statement;
}

/** Site-wide counts, calculated from content so no page hard-codes them. */
export async function getSiteCounts(): Promise<{ experiments: number; findings: number; topics: number }> {
  const { getPublishedExperiments } = await import('./collections');
  const { getTopicsWithContent } = await import('./topics');
  const [experiments, topics] = await Promise.all([getPublishedExperiments(), getTopicsWithContent()]);
  const findings = experiments.reduce(
    (n, e) => n + (e.data.findings ?? []).filter((f) => f.status !== 'superseded').length,
    0,
  );
  return { experiments: experiments.length, findings, topics: topics.length };
}
