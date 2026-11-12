import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

/**
 * Copy of the secondary pages (`src/content/pages/<page>/{fr,en}.yaml`). Strict objects, so a key
 * missing or added in one locale fails the build and FR/EN stay in sync.
 */
const seo = z.strictObject({ title: z.string(), description: z.string() });

/** /demo — booking page with the inline Cal.com agenda. */
export const demoPage = z.strictObject({
  seo,
  title: z.string(),
  titleAccent: z.string(),
  lead: z.string(),
  agendaTitle: z.string(),
  agendaHint: z.string(),
  /** Shown inside the agenda frame until Cal.com has loaded (and when JS is off). */
  agendaFallback: z.string(),
  agendaFallbackLink: z.string(),
  /**
   * The agents the visitor is interested in, picked before the agenda: the choice is handed to the
   * Cal.com booking (field `agents`, and the notes). Hidden when the pricing form already sent it.
   */
  agents: z.strictObject({
    titre: z.string(),
    aide: z.string(),
    /** « Not sure yet »: exclusive with the agents. */
    inconnu: z.string(),
    /** Line written in the booking notes, followed by the picked agents. */
    note: z.string(),
    /** Shown in place of the agenda until at least one choice is ticked. */
    verrou: z.string(),
  }),
});

/**
 * /securite (César 01/10): the content of the current site (v1), four themes of three points each,
 * in the v2 design — voxel agents in the hero, access control shown on an iPad (who sees what in the
 * BunBun network), one call to action. Every claim must be true of Hatch OS: hosting is in Europe.
 */
const accessState = z.enum(['visible', 'perimetre', 'masque']);
const item = z.strictObject({ title: z.string(), text: z.string() });
export const securityPage = z.strictObject({
  seo,
  hero: z.strictObject({
    kicker: z.string(),
    title: z.string(),
    lead: z.string(),
    /** Key promises, each a link down to the theme that backs it (`section`: its index). */
    proofs: z
      .array(z.strictObject({ label: z.string(), section: z.number().int().min(0).max(3) }))
      .min(2)
      .max(4),
    /** Alt texts of the three agents (Jay: servers and EU flag, Owl: safe, Finch: stamp). */
    alts: z.strictObject({ jay: z.string(), owl: z.string(), finch: z.string() }),
  }),
  sections: z
    .array(
      z.strictObject({
        /** Function of the theme, also the hero's anchor to it. */
        kicker: z.string(),
        title: z.string(),
        subtitle: z.string(),
        items: z.array(item).length(3),
        /** Shown by: an agent (its image, alt from `hero.alts`), or the access screen (iPad). */
        visual: z.enum(['jay', 'owl', 'finch', 'ecran']),
      }),
    )
    .length(4),
  /** The iPad screen: one view per role, each row visible, limited to the role's scope, or hidden. */
  screen: z.strictObject({
    app: z.string(),
    viewing: z.string(),
    roles: z.array(z.string()).length(3),
    states: z.strictObject({
      visible: z.string(),
      perimetre: z.string(),
      masque: z.string(),
      nonPartage: z.string(),
    }),
    rows: z
      .array(
        z.strictObject({
          label: z.string(),
          meta: z.string(),
          /** One state per role; absent = the source is not shared with Hatch at all. */
          access: z.array(accessState).length(3).optional(),
        }),
      )
      .min(3)
      .max(5),
  }),
  contact: z.strictObject({ title: z.string(), text: z.string() }),
});

/**
 * One Sans Filtre edition = one Markdown file (`src/content/sans-filtre/2026-07.md`) holding both
 * locales. Images are paths relative to the file (`../../assets/sans-filtre/…`); `video` is a file
 * name in `src/assets/sans-filtre/`.
 */
const sfAgent = z.enum(['peep', 'jay', 'sparrow', 'finch', 'pecker']);

export const sansFiltreEdition = ({ image }: SchemaContext) => {
  const update = z.strictObject({
    title: z.string(),
    desc: z.string(),
    shippedBy: z.string(),
    date: z.string(),
    agent: sfAgent.optional(),
    image: image().optional(),
    video: z.string().optional(),
    logo: image().optional(),
    emojis: z.array(z.string()).max(6).optional(),
    /** Showcase layout: big media on top, text centred below. */
    highlight: z.boolean().optional(),
  });
  const edition = z.strictObject({
    month: z.string(),
    dateline: z.string(),
    issueTitle: z.string(),
    /** Meta description of the edition page: 120 to 160 characters, full sentences. */
    description: z.string(),
    intro: z.string(),
    signature: z.string(),
    featured: z.strictObject({
      eyebrow: z.string(),
      title: z.string(),
      body: z.array(z.string()),
      shippedBy: z.string(),
      date: z.string(),
      agent: sfAgent.optional(),
      image: image().optional(),
    }),
    updates: z.array(update),
    horsDesClousTitle: z.string(),
    horsDesClousHeading: z.string(),
    horsDesClous: z.array(z.string()),
    horsDesClousMotto: z.string(),
    ctaTitle: z.string(),
    ctaText: z.string(),
    ctaBtn: z.string(),
  });
  return z.strictObject({
    edition: z.string().regex(/^\d{3}$/),
    updatesCount: z.string().regex(/^\d{3}$/),
    /** ISO date, drives the order (newest first). */
    date: z.iso.date(),
    location: z.string(),
    fr: edition,
    en: edition,
  });
};

/** /sans-filtre — page chrome of the monthly changelog (the editions live in src/content/sans-filtre). */
export const sansFiltrePage = z.strictObject({
  seo,
  /** Suffix of an edition page's <title>: "<month> · <titleSuffix>". */
  titleSuffix: z.string(),
  homeLabel: z.string(),
  monthly: z.string(),
  tag: z.string(),
  sub: z.string(),
  subEnd: z.string(),
  editionLabel: z.string(),
  updatesLabel: z.string(),
  featured: z.string(),
  online: z.string(),
  agentRole: z.string(),
  shippedBy: z.string(),
  more: z.string(),
  pastTitle: z.string(),
  pastHint: z.string(),
  authorRoles: z.record(z.string(), z.string()),
  /** Opening and closing quote marks of the "Hors des clous" motto. */
  quotes: z.tuple([z.string(), z.string()]),
});

/**
 * Chrome of the agent pages (`/agents/<slug>`, src/views/AgentPage.astro): the section headings
 * shared by the seven agents, as Patrick wrote them. `{name}` is replaced by the agent's name.
 */
export const agentPage = z.strictObject({
  /** Names of the breadcrumb's first two steps (structured data only, not shown). */
  breadcrumb: z.strictObject({ home: z.string(), agents: z.string() }),
  actions: z.string(),
  control: z.strictObject({ title: z.string(), agent: z.string(), you: z.string() }),
  example: z.string(),
  with: z.string(),
  faq: z.string(),
  related: z.strictObject({ title: z.string(), demo: z.string() }),
});

/** Who a resource is for: independents (Robin), networks (the agents), or both. */
export const publicCible = z.enum(['independant', 'reseau', 'tous']);
export type PublicCible = z.infer<typeof publicCible>;

const texte = z.string().min(1);

/**
 * A downloadable template of /ressources. Each format points to a file of `public/ressources/`
 * (raw, never optimised); a format whose file is not there yet is not shown, nor is a template left
 * with none, nor the whole section when no template has a file.
 */
const modele = z.strictObject({
  public: publicCible,
  titre: texte,
  texte,
  formats: z
    .array(
      z.strictObject({
        format: z.enum(['PDF', 'Sheets', 'Docs']),
        /** File name in public/ressources/ (e.g. `fiche-technique.xlsx`); absent until it exists. */
        fichier: z
          .string()
          .regex(/^[a-z0-9-]+\.(pdf|xlsx|docx)$/)
          .optional(),
      }),
    )
    .min(1),
});

/** The two ways out, at the bottom of /ressources and of each guide (by its audience). */
const sortie = z.strictObject({ kicker: texte, titre: texte, texte });

/** /ressources — the index (templates, guides, glossary preview), and the guides' shared labels. */
export const ressourcesPage = z.strictObject({
  seo,
  hero: z.strictObject({
    kicker: texte,
    titre: texte,
    chapeau: texte,
    /** aria-label of the filter's button group. */
    filtre: texte,
    filtres: z.strictObject({ tout: texte, independant: texte, reseau: texte }),
  }),
  modeles: z.strictObject({
    kicker: texte,
    titre: texte,
    texte,
    telecharger: texte,
    liste: z.array(modele).min(1),
  }),
  guides: z.strictObject({
    kicker: texte,
    titre: texte,
    texte,
    /** Heading of the featured guide (`une: true`, else the latest). */
    une: texte,
    /** Heading of the grid of every guide, and its theme filter. */
    tous: texte,
    themes: texte,
    toutTheme: texte,
    lire: texte,
  }),
  glossaire: z.strictObject({ kicker: texte, titre: texte, texte, lien: texte }),
  sorties: z.strictObject({
    independant: sortie.extend({ cta: texte }),
    reseau: sortie,
  }),
  /** Labels shared by every guide page (/ressources/<slug>). */
  guide: z.strictObject({
    /** Breadcrumb's name of /ressources (structured data and the link above the kicker). */
    retour: texte,
    /** `{n}`: the reading time in minutes. */
    lecture: texte,
    majLe: texte,
    faq: texte,
    sources: texte,
    /** Before a source's reading date: « lu le 2 octobre 2026 ». */
    luLe: texte,
    agents: texte,
    agentLien: texte,
    essentiel: texte,
    sommaire: texte,
    /** The related guides at the end (same audience first). */
    lies: texte,
  }),
});

/** /ressources/glossaire — the terms, one YAML per locale (`src/content/pages/glossaire`). */
export const glossairePage = z.strictObject({
  seo,
  kicker: texte,
  titre: texte,
  chapeau: texte,
  /** Accessible name of the A to Z letter bar. */
  lettres: texte,
  termes: z
    .array(
      z.strictObject({
        mot: texte,
        definition: texte,
        public: publicCible,
        /** Stable anchor of the term on the glossary page: never change it once published. */
        ancre: z.string().regex(/^[a-z0-9-]+$/),
      }),
    )
    .min(1)
    .refine((t) => new Set(t.map((x) => x.ancre)).size === t.length, {
      message: 'Two glossary terms share an anchor',
    }),
});
