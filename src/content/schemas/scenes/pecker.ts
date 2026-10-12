import { z } from 'astro/zod';

const texte = z.string().min(1);

/**
 * Pecker's "Exemple d'usage" scene (src/components/agents/scenes/Pecker.astro, César 11/10): each
 * step shows the device of whoever acts. Head office's Hatch OS window adds Yanis and the trigger
 * sends his course; Yanis's phone gets the WhatsApp notification and opens the link; the same phone
 * runs the course, stops, gets Pecker's reminder and passes; the manager's iPad grades him.
 */
export const schema = z.strictObject({
  agent: z.literal('pecker'),
  siege: z.strictObject({
    app: texte,
    contexte: texte,
    equipe: z
      .array(z.strictObject({ nom: texte, role: texte }))
      .min(2)
      .max(3),
    nouveau: z.strictObject({ nom: texte, role: texte, badge: texte }),
    regle: z.strictObject({ libelle: texte, quand: texte, alors: texte }),
    envoye: texte,
  }),
  telephone: z.strictObject({
    heure: texte,
    date: texte,
    notif: z.strictObject({ app: texte, quand: texte, titre: texte, texte }),
    contact: texte,
    statut: texte,
    message: texte,
    carte: z.strictObject({ titre: texte, meta: texte }),
    bouton: texte,
  }),
  formation: z.strictObject({
    module: texte,
    n: z.int().min(1),
    total: z.int().min(1),
    question: texte,
    options: z.array(texte).length(3),
    /** Index of the right option. */
    bonne: z.int().min(0).max(2),
    retour: texte,
    relance: z.strictObject({ app: texte, quand: texte, titre: texte, texte }),
    fin: z.strictObject({ titre: texte, texte }),
  }),
  evaluation: z.strictObject({
    entete: texte,
    equipier: texte,
    grille: z
      .array(z.strictObject({ texte, etat: texte, valide: z.boolean() }))
      .min(2)
      .max(4),
    score: texte,
    tampon: texte,
  }),
});
