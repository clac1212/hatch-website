import { z } from 'astro/zod';
import { tonStatut } from '../agents';

const texte = z.string().min(1);

/**
 * Lark's feature wall (src/components/agents/bento/Lark.astro), on Finch's "more real" model
 * (César 11/10): an iPad, a dark conversation, a voxel desk, a cloud of words.
 */
export const schema = z.strictObject({
  agent: z.literal('lark'),
  /** The network home page on an iPad: a greeting, three figures as large type, then a few rows. */
  accueil: z.strictObject({
    titre: texte,
    ecran: texte,
    bonjour: texte,
    source: texte,
    chiffres: z.array(z.strictObject({ valeur: z.int().min(0), libelle: texte })).length(3),
    lignes: z
      .array(z.strictObject({ texte, valeur: texte, ton: tonStatut }))
      .min(2)
      .max(4),
  }),
  /** A question about the network, then Lark's answer: a lead-in and the restaurants it names. */
  conversation: z.strictObject({
    titre: texte,
    question: texte,
    agent: texte,
    reponse: texte,
    source: texte,
    lignes: z
      .array(z.strictObject({ texte, nombre: z.int().min(1), unite: texte }))
      .min(1)
      .max(3),
  }),
  /** The network dashboard (a voxel desk, its screen a rising chart). */
  tableau: z.strictObject({ titre: texte }),
  /** The topics coming up from the field: each theme, sized by how many questions it gathered. */
  sujets: z.strictObject({
    titre: texte,
    unite: texte,
    source: texte,
    themes: z
      .array(z.strictObject({ texte, nombre: z.int().min(1) }))
      .min(3)
      .max(6),
  }),
});
