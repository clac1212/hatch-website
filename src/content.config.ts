import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Home page copy, one YAML file per locale (`fr.yaml`, `en.yaml`).
 * Strict objects: a key missing or added in one locale fails the build, so FR and EN stay in sync.
 * Each section adds its own block here as it is built.
 */
const home = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home' }),
  schema: z.strictObject({
    seo: z.strictObject({
      title: z.string(),
      description: z.string(),
    }),
    hero: z.strictObject({
      h1: z.string(),
      lead: z.string(),
    }),
  }),
});

/**
 * The seven agents, one Markdown file per agent and per locale (`fr/peep.md`, `en/peep.md`).
 * The body is the agent's dedicated page; `page: false` until Rako's copy for it is ready.
 */
const agents = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/agents' }),
  schema: z.strictObject({
    name: z.string(),
    job: z.string(),
    pitch: z.string(),
    order: z.int().min(1),
    page: z.boolean(),
  }),
});

export const collections = { home, agents };
