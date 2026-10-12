import { z } from 'astro/zod';

const texte = z.string().min(1);

/** The kiosk tablet's top bar and its voice states, shared by both of its screens. */
const kiosque = z.strictObject({
  app: texte,
  contexte: texte,
  mode: texte,
  /** The mic's state under the waveform: idle, listening, Owl speaking. */
  repos: texte,
  ecoute: texte,
  parle: texte,
});

/**
 * Owl's "Exemple d'usage" scene (src/components/agents/scenes/Owl.astro, César 11/10): each step
 * shows the device of whoever acts. The kitchen tablet in kiosk mode: a crew member taps the mic and
 * asks, the words write themselves, Owl answers with the network's sheet; the same tablet reads the
 * whole sheet aloud, line by line; at 15:00 the manager asks Owl on his iPhone how lunch service
 * went: the question count climbs, nothing was passed on to him.
 */
export const schema = z.strictObject({
  agent: z.literal('owl'),
  kiosque,
  question: z.strictObject({
    qui: texte,
    texte,
    reponse: z.strictObject({
      libelle: texte,
      titre: texte,
      texte,
      source: texte,
      lire: texte,
    }),
  }),
  lecture: z.strictObject({
    qui: texte,
    texte,
    libelle: texte,
    titre: texte,
    etapes: z
      .array(z.strictObject({ texte, valeur: texte }))
      .min(2)
      .max(4),
    pastilles: z.array(texte).length(2),
  }),
  manager: z.strictObject({
    heure: texte,
    app: texte,
    contexte: texte,
    question: texte,
    placeholder: texte,
    libelle: texte,
    questions: z.int().min(1),
    unite: texte,
    sousTitre: texte,
    plusPosees: texte,
    lignes: z
      .array(z.strictObject({ texte, nombre: texte, etat: texte }))
      .min(1)
      .max(3),
    transmises: z.strictObject({ texte, nombre: texte }),
    tampon: texte,
  }),
});
