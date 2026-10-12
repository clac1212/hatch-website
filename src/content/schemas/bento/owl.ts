import { z } from 'astro/zod';

const texte = z.string().min(1);
/** A Lucide icon, by its file name in @lucide/astro (see Icone.astro). */
const icone = z.string().regex(/^[a-z0-9-]+$/);

/** Owl's feature wall (src/components/agents/bento/Owl.astro, Pencil "Page agent — Owl"). */
export const schema = z.strictObject({
  agent: z.literal('owl'),
  /** The voxel render of the kitchen tablet in kiosk mode, the title over it. */
  kiosque: z.strictObject({ titre: texte }),
  /** A dark tile: a large waveform, the question it carried, and the "voice dictation" chip. */
  voix: z.strictObject({ titre: texte, question: texte, pastille: texte }),
  /**
   * The documents Owl answers from, as printed sheets on a stainless counter: a name, where it
   * lives. `extrait` is the line highlighted on the first sheet, the answer to the voice question.
   */
  documents: z.strictObject({
    titre: texte,
    extrait: texte,
    sources: z
      .array(z.strictObject({ texte, source: texte, icone }))
      .min(2)
      .max(4),
  }),
  /** An iPad showing a tablet's profile (`ecran`) and the tags that set what it sees, as switches. */
  restaurant: z.strictObject({
    titre: texte,
    ecran: texte,
    tablette: texte,
    etiquettes: z.array(texte).min(1).max(5),
  }),
});
