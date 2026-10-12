import { z } from 'astro/zod';

const texte = z.string().min(1);
const icone = z.string().regex(/^[a-z0-9-]+$/);
const pourcent = z.number().min(0).max(100);

/** Sparrow's feature wall (src/components/agents/bento/Sparrow.astro, Pencil "Page agent — Sparrow"). */
export const schema = z.strictObject({
  agent: z.literal('sparrow'),
  /** The brand's WhatsApp number: a QR code on a trade-show stand, then the three ways in (Lucide icon each). */
  numero: z.strictObject({
    titre: texte,
    entrees: z.array(z.strictObject({ texte, icone })).length(3),
  }),
  /** A reminder on the candidate's lock screen: the time, the brand's WhatsApp message, its delay. */
  relances: z.strictObject({
    titre: texte,
    heure: texte,
    app: texte,
    expediteur: texte,
    message: texte,
    pastille: texte,
  }),
  reprise: z.strictObject({ titre: texte, bouton: texte }),
  /**
   * A WhatsApp exchange on a phone (the status bar's time, the brand's contact): Sparrow's question,
   * the candidate's answer, and beside the phone the criteria it checks.
   */
  prequalification: z.strictObject({
    titre: texte,
    heure: texte,
    contact: texte,
    question: texte,
    reponse: texte,
    criteres: z
      .array(z.strictObject({ texte, verifie: z.boolean() }))
      .min(2)
      .max(4),
  }),
  /** The documents asked of the project owner, over a photo of the works: received or missing. */
  chantier: z.strictObject({
    titre: texte,
    pieces: z
      .array(z.strictObject({ texte, etat: texte, recu: z.boolean() }))
      .min(2)
      .max(3),
  }),
  espace: z.strictObject({
    titre: texte,
    faites: z.int().min(0),
    total: z.int().min(1),
    legende: texte,
  }),
  /** The pipeline's stages and how many candidates each holds; the last one is highlighted. */
  pipeline: z.strictObject({
    titre: texte,
    etapes: z.array(z.strictObject({ valeur: z.int().min(0), libelle: texte })).length(4),
  }),
  tableau: z.strictObject({ titre: texte, valeur: z.int().min(0), legende: texte }),
  /**
   * The opening's back-schedule on a tablet (`ecran`, the restaurant it is for): one bar per task, from `debut` to `fin` (percent of the plan),
   * coloured by its state (done, under way, to come, the opening day).
   */
  ouverture: z.strictObject({
    titre: texte,
    ecran: texte,
    pastille: texte,
    taches: z
      .array(
        z.strictObject({
          texte,
          debut: pourcent,
          fin: pourcent,
          etat: z.enum(['fait', 'en-cours', 'a-venir', 'jalon']),
        }),
      )
      .min(3)
      .max(6),
  }),
});
