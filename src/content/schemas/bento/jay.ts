import { z } from 'astro/zod';
import { agentSlugs } from '../agents';

const texte = z.string().min(1);
/** A Lucide icon, by its file name in @lucide/astro, see Icone.astro. */
const icone = z.string().regex(/^[a-z0-9-]+$/);

/** Jay's feature wall (src/components/agents/bento/Jay.astro, Pencil "Page agent — Jay"). */
export const schema = z.strictObject({
  agent: z.literal('jay'),
  /** The four connected tools as app icons, and the last sync. */
  outils: z.strictObject({
    titre: texte,
    apps: z
      .array(
        z.strictObject({
          nom: texte,
          icone,
          ton: z.enum(['vert', 'noir', 'jaune', 'bleu']),
        }),
      )
      .length(4),
    synchro: texte,
  }),
  /** Imported file types, one coloured sheet each. */
  imports: z.strictObject({
    titre: texte,
    fichiers: z
      .array(z.strictObject({ type: texte, ton: z.enum(['rouge', 'vert', 'violet']) }))
      .min(2)
      .max(3),
  }),
  /** Profiles that see a document (checked) or not (locked). */
  acces: z.strictObject({
    titre: texte,
    profils: z
      .array(z.strictObject({ texte, voit: z.boolean() }))
      .min(2)
      .max(4),
  }),
  /**
   * The printed procedure the answer comes from: its lines before and after the passage Jay cites
   * (highlighted, hence exactly one), and the source pinned to the sheet.
   */
  sources: z.strictObject({
    titre: texte,
    document: texte,
    avant: z.array(texte).min(1).max(2),
    passage: texte,
    apres: z.array(texte).min(1).max(2),
    source: texte,
  }),
  /** A document switched off in the AI's answers. */
  exclure: z.strictObject({ titre: texte, document: texte, etat: texte }),
  /** The agents that answer from Jay's knowledge, on their render's tint. */
  nourrit: z.strictObject({
    titre: texte,
    agents: z
      .array(z.strictObject({ agent: z.enum(agentSlugs), nom: texte, texte }))
      .min(2)
      .max(4),
  }),
  /** "Éditer avec Jay": a sheet with a selected line, and the menu of rewrites. */
  redaction: z.strictObject({
    titre: texte,
    fiche: texte,
    selection: texte,
    suite: texte,
    menu: texte,
    actions: z.array(texte).min(2).max(4),
  }),
});
