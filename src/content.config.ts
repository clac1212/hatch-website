/**
 * Content Collections schema — Astro Content Layer API.
 *
 * Marketing copy lives in Markdown frontmatter. Schemas validate at build
 * time so a missing field or typo fails the build instead of shipping.
 *
 * Two collections:
 *   - landing  → one entry per locale (fr, en) with all section copy
 *   - agents   → one entry per agent (peep, jay, sparrow, rook, piper, kite)
 *                with both fr and en blocks embedded
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Many headings, eyebrows, and rich-text strings contain inline HTML
// (`<em>`, `<br>`, `<strong>`, …) that is rendered via `set:html` in
// components. Using z.string() at the schema level is intentional — these
// are authored copy, not user input.
const richString = z.string();

const tier = z.object({
  bracket: richString, // e.g. "1–50 établissements"
  unit: richString.optional(), // e.g. "/loc/mois" — undefined for Enterprise
  price: richString.optional(), // numeric € price OR "Sur mesure" text label
  desc: richString,
  btn: richString,
});

const landing = defineCollection({
  loader: glob({ base: './src/content/landing', pattern: '**/*.md' }),
  schema: z.object({
    title: richString,
    description: richString,

    hero: z.object({
      eyebrow: richString,
      h1: richString, // contains <br>, <em>
      sub: richString, // contains inline SVG badges (Hatch + WhatsApp)
      ctaDemo: richString,
      ctaProduct: richString,
      trustLabel: richString,
    }),

    why: z.object({
      pillLabel: richString,
      h2: richString, // contains <em>
      feat1: richString, // <strong> + paragraph
      feat2: richString,
      feat3: richString,
      // mockup card strings
      waName: richString,
      waStatus: richString,
      waDate: richString,
      waMeta: richString,
      waMsg: richString, // long HTML
      waCtaTxt: richString,
      waBtn: richString,
      jayGreeting: richString,
      chip1: richString,
      chip2: richString,
      chip3: richString,
      chip4: richString,
      jayPlaceholder: richString,
      jayHint: richString,
      pipeTitle: richString,
      pipeSub: richString,
      pipePhase1: richString,
      pipeStage1: richString,
      pipePhase2: richString,
      pipeStage2: richString,
      pipePhase3: richString,
      pipePhase4: richString,
      pipeEmpty: richString,
    }),

    hiw: z.object({
      label: richString,
      h2: richString,
      sub: richString,
      step1Title: richString,
      step1Desc: richString,
      step2Title: richString,
      step2Desc: richString,
      step3Title: richString,
      step3Desc: richString,
      sourceLabel: richString,
      agentsLabel: richString,
      stat1: richString,
      stat2: richString,
    }),

    hub: z.object({
      pill: richString,
      h2: richString,
      sub: richString,
      centerLabel: richString,
    }),

    agents: z.object({
      label: richString,
      h2: richString,
      sub: richString,
      panelSectionLabel: richString,
      comingBadge: richString,
      comingText: richString,
      statusLive: richString,
      statusSoon: richString,
      tabSoon: richString,
      featureNew: richString,
    }),

    pricing: z.object({
      label: richString,
      h2: richString,
      sub: richString,
      annualPill: richString,
      toggleFranchise: richString,
      toggleDark: richString,
      footnote: richString,
      franchise: z.object({
        core: tier,
        scale: tier,
        enterprise: tier,
      }),
      darkKitchen: z.object({
        core: tier,
        scale: tier,
        enterprise: tier,
      }),
    }),

    faq: z.object({
      h2: richString,
      items: z.array(z.object({ q: richString, a: richString })),
    }),

    nav: z.object({
      why: richString,
      product: richString,
      pricing: richString,
      faq: richString,
      eyebrow: richString,
    }),

    footer: z.object({
      tagline: richString,
      copyright: richString,
    }),
  }),
});

const agents = defineCollection({
  loader: glob({ base: './src/content/agents', pattern: '**/*.md' }),
  schema: z.object({
    key: z.enum(['peep', 'jay', 'sparrow', 'legal', 'marketing', 'innovation']),
    order: z.number(), // 1..6, drives tab order
    num: z.string(), // "AGT·01"
    name: z.string(), // "Peep"
    species: z.string(), // "Phasianus poussin operatus"
    status: z.enum(['live', 'soon']),
    bg: z.string(), // CSS color string for panel-left ::before background
    fr: z.object({
      role: z.string(), // tab-role short label, e.g. "Opérations"
      desc: z.string(),
      features: z.array(
        z.object({
          icon: z.string(),
          name: z.string(),
          desc: z.string(),
          isNew: z.boolean().optional(),
        }),
      ),
    }),
    en: z.object({
      role: z.string(),
      desc: z.string(),
      features: z.array(
        z.object({
          icon: z.string(),
          name: z.string(),
          desc: z.string(),
          isNew: z.boolean().optional(),
        }),
      ),
    }),
  }),
});

export const collections = { landing, agents };
