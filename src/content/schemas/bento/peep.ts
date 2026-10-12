import { z } from 'astro/zod';
import { tonStatut } from '../agents';

const texte = z.string().min(1);

/** Peep's feature wall (src/components/agents/bento/Peep.astro, Pencil "Page agent — Peep v4"). */
export const schema = z.strictObject({
  agent: z.literal('peep'),
  /** An iPhone on a WhatsApp chat: the field asks, Peep answers with the sheet. */
  terrain: z.strictObject({
    titre: texte,
    contact: texte,
    statut: texte,
    jour: texte,
    messages: z
      .array(
        z.union([
          z.strictObject({ de: z.literal('equipe'), texte, heure: texte }),
          z.strictObject({
            de: z.literal('agent'),
            document: z.strictObject({ titre: texte, meta: texte }).optional(),
            texte,
            signature: texte,
          }),
        ]),
      )
      .min(2)
      .max(5),
  }),
  vocal: z.strictObject({ titre: texte, duree: texte, transcription: texte }),
  installer: z.strictObject({ titre: texte }),
  langues: z.strictObject({
    titre: texte,
    /** `lang`: the BCP 47 tag of each sentence (fr, bn, es, ta, en…), set on its element. */
    phrases: z
      .array(z.strictObject({ lang: z.string().regex(/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/), texte }))
      .length(5),
  }),
  invente: z.strictObject({
    titre: texte,
    texte,
    notif: z.strictObject({ titre: texte, meta: texte }),
  }),
  ciblage: z.strictObject({
    titre: texte,
    etiquettes: z
      .array(z.strictObject({ texte, actif: z.boolean() }))
      .min(2)
      .max(5),
    total: texte,
  }),
  lecture: z.strictObject({
    titre: texte,
    valeur: z.int().min(0),
    sur: z.int().min(1),
    legende: texte,
    lignes: z
      .array(z.strictObject({ texte, etat: texte, ton: tonStatut }))
      .min(3)
      .max(6),
  }),
  redaction: z.strictObject({
    titre: texte,
    ideeLibelle: texte,
    idee: texte,
    banniere: texte,
    texte,
    pastille: texte,
  }),
  /** A voxel desk calendar and alarm clock, the send time on a pill. */
  envoi: z.strictObject({ titre: texte, heure: texte }),
});
