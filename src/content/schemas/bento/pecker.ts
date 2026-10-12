import { z } from 'astro/zod';
import { tonStatut } from '../agents';

const texte = z.string().min(1);

/**
 * Pecker's feature wall (src/components/agents/bento/Pecker.astro), in the mixed registers of the
 * "more real" walls (César 11/10): a real phone, a field photo, a voxel object, a dark score tile,
 * typography, a sheet of paper, an iPad, stacked course cards.
 */
export const schema = z.strictObject({
  agent: z.literal('pecker'),
  /** The magic link reaching a crew member: a WhatsApp chat on a phone, then what it spares. */
  lien: z.strictObject({
    titre: texte,
    heure: texte,
    expediteur: texte,
    compte: texte,
    jour: texte,
    /** The link's preview card: the course and its details. */
    parcours: texte,
    meta: texte,
    message: texte,
    envoi: texte,
    bouton: texte,
    garanties: z.array(texte).min(1).max(3),
  }),
  /** A trigger, over a photo of a new crew member: the event, then the course it sends. */
  declencheurs: z.strictObject({ titre: texte, evenement: texte, parcours: texte }),
  relance: z.strictObject({ titre: texte, pastille: texte }),
  /** A quiz score: one cell per question (right or not), then the question to review. */
  quiz: z.strictObject({
    titre: texte,
    legende: texte,
    reponses: z.array(z.boolean()).min(4).max(12),
    rate: z.strictObject({ etat: texte, texte }),
  }),
  /** One word in several languages, in decreasing sizes; `lang` is its BCP 47 code. */
  traduction: z.strictObject({
    titre: texte,
    mots: z
      .array(z.strictObject({ lang: z.string().regex(/^[a-z]{2,3}$/), texte }))
      .min(3)
      .max(5),
  }),
  /** A skills grid as a sheet of paper: the criteria checked or not, then the filing stamp. */
  evaluation: z.strictObject({
    titre: texte,
    document: texte,
    criteres: z
      .array(z.strictObject({ texte, valide: z.boolean() }))
      .min(2)
      .max(4),
    tampon: texte,
  }),
  /** Crew member by crew member, how far they are in a course (an iPad). */
  tableau: z.strictObject({
    titre: texte,
    ecran: texte,
    texte,
    lignes: z
      .array(
        z.strictObject({
          texte,
          etat: texte,
          ton: tonStatut,
          progression: z.int().min(0).max(100),
        }),
      )
      .min(3)
      .max(6),
  }),
  /** The course editor: its modules as stacked cards, each with a cover drawn from its type. */
  editeur: z.strictObject({
    titre: texte,
    modules: z
      .array(
        z.strictObject({
          numero: texte,
          titre: texte,
          meta: texte,
          type: z.enum(['ecrans', 'quiz', 'video']),
        }),
      )
      .min(2)
      .max(3),
  }),
});
