import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const views = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/views',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** Set true to keep a file in the folder without publishing it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  views,
};
