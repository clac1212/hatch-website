import { z } from 'astro/zod';
import { tonStatut } from '../agents';

const texte = z.string().min(1);

/**
 * Finch's feature wall (src/components/agents/bento/Finch.astro), the pilot of the "more real"
 * walls (César 11/10): a real phone, typography, a dark score tile, paper, a lock-screen
 * notification, a voxel object, before/after photos, an iPad.
 */
export const schema = z.strictObject({
  agent: z.literal('finch'),
  /** The audit app on a phone: the checkpoint, its photo, the answer picked, the previous audit. */
  mobile: z.strictObject({
    titre: texte,
    app: texte,
    heure: texte,
    point: texte,
    /** Progress through the checklist: checkpoint `n` of `total`. */
    n: z.int().min(1),
    total: z.int().min(1),
    controle: texte,
    conforme: texte,
    nonConforme: texte,
    historique: texte,
  }),
  /** The checklist's sections and their weight, as large type. */
  grilles: z.strictObject({
    titre: texte,
    lignes: z
      .array(z.strictObject({ texte, poids: texte }))
      .min(2)
      .max(3),
  }),
  score: z.strictObject({ titre: texte, valeur: z.int().min(0).max(100), sur: texte }),
  /** The AI's action plan, as a sheet of paper: who wrote it, then one gap per row. */
  plan: z.strictObject({
    titre: texte,
    document: texte,
    signature: texte,
    lignes: z
      .array(z.strictObject({ texte, etat: texte, ton: tonStatut }))
      .min(3)
      .max(5),
  }),
  /** The report reaching the franchisee: a WhatsApp notification on a lock screen. */
  rapport: z.strictObject({
    titre: texte,
    heure: texte,
    app: texte,
    quand: texte,
    expediteur: texte,
    document: texte,
  }),
  auto: z.strictObject({ titre: texte, texte }),
  /** Drifting checkpoints on the network dashboard (an iPad): restaurants failing each one. */
  tableau: z.strictObject({
    titre: texte,
    ecran: texte,
    texte,
    unite: texte,
    sur: z.int().min(1),
    lignes: z
      .array(z.strictObject({ texte, restaurants: z.int().min(1) }))
      .min(2)
      .max(4),
  }),
  /** Proof of correction: the photo before, the photo after, and the stamp once approved. */
  preuves: z.strictObject({
    titre: texte,
    legende: texte,
    avant: texte,
    apres: texte,
    tampon: texte,
  }),
});
