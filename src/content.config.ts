import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { isTopicId } from './data/topics';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  /** One-line card summary; falls back to description. */
  summary: z.string().optional(),
  /** Optional homepage editorial pick. */
  featured: z.boolean().default(false),
  /** Set true to keep a file without publishing it. */
  draft: z.boolean().default(false),
  /** Optional share-preview image (path under /public). */
  previewImage: z.string().optional(),
  previewAlt: z.string().optional(),
  /** Optional topics (ids from src/data/topics.ts); used for related reading. */
  topics: z.array(z.string().refine(isTopicId, { message: 'Unknown topic id' })).default([]),
  /** Optional video about this article (YouTube). Only set when one exists. */
  video: z.object({ url: z.string().url(), label: z.string().optional() }).optional(),
});

/**
 * Finding record — defined once on an experiment.
 * IDs are globally unique: <experimentId>-<n> (e.g. J-1). Never reused.
 */
const findingSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_.]*-\d+$/, {
    message: 'Finding id must look like <experimentId>-<n> (e.g. J-1)',
  }),
  statement: z.string().min(1),
  metric: z.string().optional(),
  value: z.string().optional(),
  interval: z
    .object({
      low: z.string(),
      high: z.string(),
      method: z.string(),
    })
    .optional(),
  n: z.union([z.number(), z.string()]).optional(),
  /** Supporting figures: what was compared and the numbers per arm. */
  detail: z.array(z.string()).optional(),
  limits: z.array(z.string()).min(1),
  source: z.string().url(),
  status: z.enum(['current', 'superseded']).default('current'),
  featured: z.boolean().default(false),
  /** Optional: 1 is shown first in the homepage "what the experiments show" strip (at most three). */
  homeRank: z.number().int().positive().optional(),
});

const agentSchema = z.object({
  name: z.string(),
  model: z.string(),
  settings: z.string().optional(),
});

/**
 * Experiments — transitional schema (Phase 1 approach A).
 * Existing card fields stay required so the two live pages keep building unchanged.
 * Structured finding fields are optional until an experiment opts into `status`.
 * When `status` is set, check:content enforces published/superseded rules.
 */
const experimentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  /** Short type tag shown on cards, e.g. "Controlled trial". */
  type: z.string(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  github: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  guideLinks: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),

  // —— Structured fields (optional during transition) ——
  /** Short id matching source naming (e.g. J, D2). Required when status is set. */
  experimentId: z.string().min(1).optional(),
  question: z.string().optional(),
  status: z.enum(['planned', 'running', 'published', 'superseded']).optional(),
  supersededBy: z.string().optional(),
  evidenceGrade: z.enum(['published', 'unpublished']).optional(),
  agents: z.array(agentSchema).optional(),
  plainTitle: z.string().optional(),
  /** Existing chart from this experiment, shown on the listing card (path under /public). */
  previewImage: z.string().optional(),
  previewAlt: z.string().optional(),
  runs: z.union([z.number(), z.string()]).optional(),
  repo: z.string().url().optional(),
  report: z.string().url().optional(),
  prediction: z.string().url().optional(),
  /** Optional video that explains this experiment (YouTube). Only set when one exists. */
  video: z.object({ url: z.string().url(), label: z.string().optional() }).optional(),
  topics: z.array(z.string().refine(isTopicId, { message: 'Unknown topic id' })).optional(),
  publishedOn: z.coerce.date().optional(),
  findings: z.array(findingSchema).default([]),
});

const guideSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  /** Public path to the multi-page guide. */
  href: z.string(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

/**
 * One release / announcement inside a weekday news roundup.
 * `releasedOn` is the source’s own wording (UK time when given).
 */
const newsItemSchema = z.object({
  vendor: z.string().min(1),
  /** Product or release title as the source names it. */
  title: z.string().min(1),
  releasedOn: z.string().min(1),
  body: z.string().min(1),
  whoItAffects: z.string().optional(),
  sourceUrl: z.string().url(),
  sourceLabel: z.string().min(1),
});

const newsSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  featured: z.boolean().default(false),
  /** Default false — weekday posts go live automatically. */
  draft: z.boolean().default(false),
  items: z.array(newsItemSchema).min(1),
});

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/articles',
  }),
  schema: articleSchema,
});

const architecture = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/architecture',
  }),
  schema: articleSchema,
});

const experiments = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/experiments',
  }),
  schema: experimentSchema,
});

const guides = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/guides',
  }),
  schema: guideSchema,
});

const news = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/news',
  }),
  schema: newsSchema,
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  articles,
  architecture,
  experiments,
  guides,
  news,
};
