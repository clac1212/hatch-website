import { z } from 'astro/zod';

const texte = z.string().min(1);
const fiche = z.strictObject({ titre: texte, meta: texte });

/**
 * Peep's "Exemple d'usage" scene (src/components/agents/scenes/Peep.astro, César 11/10): each step
 * shows the device of whoever acts. Claire's Hatch OS window: her request types itself, Peep drafts
 * the announcement (photo, sheet, three quiz questions); a crew member's iPhone: Monday 9:00 the
 * WhatsApp notification lands, the announcement opens, the quiz starts; Claire's window on Tuesday:
 * read tracking fills, the unread restaurants stand out, she sends a reminder; the Lyon Part-Dieu
 * crew member's iPhone: his plating question, Peep's answer from the sheet.
 */
export const schema = z.strictObject({
  agent: z.literal('peep'),
  redaction: z.strictObject({
    app: texte,
    contexte: texte,
    demande: z.strictObject({ qui: texte, texte }),
    agent: texte,
    redige: texte,
    annonce: z.strictObject({ titre: texte, texte, fiche }),
    quiz: z.strictObject({ libelle: texte, questions: z.array(texte).length(3) }),
    boutons: z.tuple([texte, texte]),
  }),
  telephone: z.strictObject({
    heure: texte,
    date: texte,
    notif: z.strictObject({ app: texte, quand: texte, titre: texte, texte }),
    contact: texte,
    statut: texte,
    /** The chat's day separator, shown in both phone steps (Monday, then Tuesday: "today"). */
    jour: texte,
    annonce: z.strictObject({ titre: texte, texte, fiche, heure: texte }),
    quiz: z.strictObject({ titre: texte, meta: texte, bouton: texte }),
    /** The crew member's reply (the quiz button's text, sent back) and Peep's first question. */
    reponse: z.strictObject({ texte, heure: texte }),
    question: z.strictObject({ texte, heure: texte }),
  }),
  suivi: z.strictObject({
    app: texte,
    contexte: texte,
    libelle: texte,
    lus: z.int().min(0),
    total: z.int().min(1),
    legende: texte,
    onglets: z.tuple([texte, texte]),
    /** A sample of the targeted restaurants; `lu: false` ones are the unread, kept by the filter. */
    restaurants: z
      .array(z.strictObject({ nom: texte, etat: texte, lu: z.boolean() }))
      .min(4)
      .max(7),
    relance: z.strictObject({ bouton: texte, fait: texte, etat: texte, auto: texte }),
    quiz: z.strictObject({ libelle: texte, texte }),
  }),
  question: z.strictObject({
    saisie: texte,
    texte,
    heure: texte,
    ecrit: texte,
    reponse: z.strictObject({ source: fiche, titre: texte, texte, signature: texte }),
  }),
});
