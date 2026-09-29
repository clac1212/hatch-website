import { z } from 'astro/zod';

/**
 * Copy of the scroll-driven product demo (src/content/sections/demo/{fr,en}.yaml): three diorama
 * scenes (head office, kitchen, build site), each with its on-image labels, chat threads, cards and
 * one glass panel per step. Geometry (positions, zoom, camera focus) lives in Demo.astro.
 * In `…Gras` strings, `**x**` marks the figures set in bold.
 */
const texte = z.string().min(1);

const panneau = z.strictObject({
  surtitre: texte,
  titre: texte,
  texte: texte,
});

/** A chat bubble: optional sender line, body, optional footer (time, "read out loud · 20 s"). */
const bulle = z.strictObject({
  qui: texte.optional(),
  texte: texte,
  meta: texte.optional(),
});

export const schema = z.strictObject({
  /** Visually hidden section title (the v4 shows none). */
  titre: texte,
  siege: z.strictObject({
    alt: texte,
    etiquettes: z.strictObject({ lark: texte, jay: texte, finch: texte }),
    peep: z.strictObject({ question: bulle, reponse: bulle }),
    lark: z.strictObject({ titre: texte, chiffresGras: texte, rappel: texte }),
    jay: z.strictObject({ titre: texte, document: texte, diffusion: texte }),
    finch: z.strictObject({
      titre: texte,
      coches: z.array(texte).length(3),
      score: texte,
      bareme: texte,
    }),
    /** Steps 1 → 4 (step 0 is the wide shot, without a panel). */
    panneaux: z.array(panneau).length(4),
  }),
  cuisine: z.strictObject({
    alt: texte,
    etiquettes: z.strictObject({ owl: texte, pecker: texte }),
    owl: z.strictObject({ question: bulle, reponse: bulle }),
    pecker: z.strictObject({ titre: texte, module: texte, coches: z.array(texte).length(3) }),
    /** Steps 0 → 2. */
    panneaux: z.array(panneau).length(3),
  }),
  chantier: z.strictObject({
    alt: texte,
    etiquettes: z.strictObject({ sparrow: texte }),
    avancement: z.strictObject({
      titre: texte,
      ligneGras: texte,
      /** Width of the progress bar, in %. */
      progression: z.number().min(0).max(100),
    }),
    sparrow: z.strictObject({ question: bulle, reponse: bulle }),
    /** Steps 0 → 2. */
    panneaux: z.array(panneau).length(3),
  }),
});
