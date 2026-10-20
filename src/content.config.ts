import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  /** One-line card summary; falls back to description. */
  summary: z.string().optional(),
  /** Set true to keep a file without publishing it. */
  draft: z.boolean().default(false),
});

const experimentSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  /** Short type tag shown on cards, e.g. "Controlled trial". */
  type: z.string(),
  draft: z.boolean().default(false),
  github: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
  guideLinks: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});

const guideSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  summary: z.string(),
  /** Public path to the multi-page guide. */
  href: z.string(),
  draft: z.boolean().default(false),
});

const articles = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/articles',
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

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  articles,
  experiments,
  guides,
};
