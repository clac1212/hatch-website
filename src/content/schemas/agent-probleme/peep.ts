import { z } from 'astro/zod';

const texte = z.string().min(1);

const message = z.strictObject({
  de: texte,
  texte: texte,
  heure: texte,
});

/**
 * The objects of Peep's problem (src/components/agents/probleme/Peep.astro): head office's launch
 * email with the recipe sheet attached; the franchisees' WhatsApp group where the same news sinks
 * under the chatter until Karim asks for it; Karim's missed call on head office's phone.
 */
export const schema = z.strictObject({
  agent: z.literal('peep'),
  mail: z.strictObject({
    de: texte,
    a: texte,
    date: texte,
    objet: texte,
    apercu: texte,
    piece: texte,
  }),
  groupe: z.strictObject({
    nom: texte,
    membres: texte,
    nonLus: texte,
    annonce: z.strictObject({ date: texte, texte: texte, heure: texte }),
    bavardage: z.array(message).min(1).max(2),
    jour: texte,
    question: message,
  }),
  appel: z.strictObject({
    app: texte,
    quand: texte,
    de: texte,
    texte: texte,
  }),
});
