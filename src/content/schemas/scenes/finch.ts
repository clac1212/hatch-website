import { z } from 'astro/zod';

const texte = z.string().min(1);
const ton = z.enum(['rouge', 'orange', 'gris', 'vert']);

/**
 * Finch's "Exemple d'usage" scene (src/components/agents/scenes/Finch.astro, César 11/10): each
 * step shows the device of whoever acts. The network coordinator's iPhone closes the audit (photo,
 * "non conforme", score, report sent); the franchisee's iPhone gets the WhatsApp report with the
 * three actions and asks where to start; the coordinator's iPad validates his photo proof and the
 * network dashboard shows where the same gap drifts.
 */
export const schema = z.strictObject({
  agent: z.literal('finch'),
  /** The action plan, shared by the audit summary (step 1) and the WhatsApp report (step 2). */
  plan: z.array(z.strictObject({ texte, criticite: texte, echeance: texte, ton })).length(3),
  audit: z.strictObject({
    heure: texte,
    app: texte,
    n: z.int().min(1),
    total: z.int().min(1),
    rubrique: texte,
    poids: texte,
    controle: texte,
    historique: texte,
    photo: texte,
    conforme: texte,
    nonConforme: texte,
    synthese: z.strictObject({
      titre: texte,
      score: z.int().min(0).max(100),
      sur: texte,
      detail: texte,
      plan: texte,
      bouton: texte,
      envoye: texte,
    }),
  }),
  franchise: z.strictObject({
    heure: texte,
    date: texte,
    notif: z.strictObject({ app: texte, quand: texte, titre: texte, texte }),
    contact: texte,
    statut: texte,
    document: z.strictObject({ type: texte, nom: texte, meta: texte }),
    message: texte,
    saisie: texte,
    question: texte,
    heureQuestion: texte,
    reponse: texte,
  }),
  validation: z.strictObject({
    app: texte,
    date: texte,
    rubrique: texte,
    controle: texte,
    criticite: texte,
    avant: texte,
    apres: texte,
    depose: texte,
    bouton: texte,
    valide: texte,
    tampon: texte,
    tableau: z.strictObject({
      libelle: texte,
      nombre: z.int().min(1),
      unite: texte,
      lignes: z
        .array(z.strictObject({ texte, etat: texte, ton }))
        .min(2)
        .max(4),
    }),
  }),
});
