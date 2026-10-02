import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { schema as hero } from './content/schemas/hero';
import { schema as clients } from './content/schemas/clients';
import { schema as probleme } from './content/schemas/probleme';
import { schema as demo } from './content/schemas/demo';
import { schema as equipe } from './content/schemas/equipe';
import { schema as cas } from './content/schemas/cas';
import { schema as miseEnPlace } from './content/schemas/miseEnPlace';
import { schema as securite } from './content/schemas/securite';
import { schema as tarifs } from './content/schemas/tarifs';
import { schema as piedDePage } from './content/schemas/piedDePage';
import { schema as agent } from './content/schemas/agents';
import { schema as customerCase } from './content/schemas/cases';
import {
  demoPage,
  securityPage,
  sansFiltrePage,
  sansFiltreEdition,
  agentPage,
  casePage,
} from './content/pages/schemas';

/**
 * One collection per home section (+ the footer): `src/content/sections/<name>/{fr,en}.yaml`,
 * validated by `src/content/schemas/<name>.ts`. Schemas are strict objects, so a key missing or
 * added in one locale fails the build and FR/EN stay in sync.
 */
const sectionCollection = <S extends z.ZodType>(name: string, schema: S) =>
  defineCollection({
    loader: glob({ pattern: '*.yaml', base: `./src/content/sections/${name}` }),
    schema,
  });

/** Page-level metadata of the home (`src/content/home/{fr,en}.yaml`). */
const home = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/home' }),
  schema: z.strictObject({
    seo: z.strictObject({ title: z.string(), description: z.string() }),
  }),
});

/**
 * The seven agents, one Markdown file per agent and per locale (`fr/peep.md`, `en/peep.md`). The
 * frontmatter's `page` block is the agent's dedicated page (/agents/<slug>); without it, no page.
 */
const agents = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/agents' }),
  schema: agent,
});

/** Customer case pages, one YAML file per case and per locale (`fr/nobinobi.yaml`). */
const cases = defineCollection({
  loader: glob({ pattern: '*/*.yaml', base: './src/content/cases' }),
  schema: customerCase,
});

/**
 * Secondary pages: one folder per page, `src/content/pages/<name>/{fr,en}.yaml`, validated by
 * `src/content/pages/schemas.ts`.
 */
const pageCollection = <S extends z.ZodType>(name: string, schema: S) =>
  defineCollection({
    loader: glob({ pattern: '*.yaml', base: `./src/content/pages/${name}` }),
    schema,
  });

/** Legal pages in Markdown, one file per page and per locale (`fr/terms.md`, `en/privacy.md`). */
const legal = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
  schema: z.strictObject({
    seo: z.strictObject({ title: z.string(), description: z.string() }),
    title: z.string(),
    /** "Mise à jour : … · Entrée en vigueur : …" line under the title. */
    meta: z.string(),
  }),
});

/** Hatch OS Sans Filtre: one Markdown file per monthly edition, both locales inside. */
const sansFiltre = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sans-filtre' }),
  schema: sansFiltreEdition,
});

export const collections = {
  legal,
  sansFiltre,
  demoPage: pageCollection('demo', demoPage),
  securityPage: pageCollection('security', securityPage),
  sansFiltrePage: pageCollection('sansFiltre', sansFiltrePage),
  agentPage: pageCollection('agent', agentPage),
  casePage: pageCollection('case', casePage),
  home,
  agents,
  cases,
  hero: sectionCollection('hero', hero),
  clients: sectionCollection('clients', clients),
  probleme: sectionCollection('probleme', probleme),
  demo: sectionCollection('demo', demo),
  equipe: sectionCollection('equipe', equipe),
  cas: sectionCollection('cas', cas),
  miseEnPlace: sectionCollection('miseEnPlace', miseEnPlace),
  securite: sectionCollection('securite', securite),
  tarifs: sectionCollection('tarifs', tarifs),
  piedDePage: sectionCollection('piedDePage', piedDePage),
};
