import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * The objects of Finch's problem (src/components/agents/probleme/Finch.astro): the March report,
 * sent by email and never answered; the action plan nobody ticked; the June audit that finds the
 * same gap, stamped.
 */
export const schema = z.strictObject({
  agent: z.literal('finch'),
  mail: z.strictObject({
    de: texte,
    objet: texte,
    date: texte,
    piece: texte,
    statut: texte,
  }),
  plan: z.strictObject({
    titre: texte,
    actions: z.array(texte).min(2).max(4),
    maj: texte,
  }),
  audit: z.strictObject({
    entete: texte,
    point: texte,
    etat: texte,
    tampon: texte,
  }),
});
