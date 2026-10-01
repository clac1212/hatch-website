import { z } from 'astro/zod';

/**
 * Copy of the diorama demo, v2 (src/content/sections/demoEtapes/{fr,en}.yaml). Two step lists under
 * comparison (César, 01/10): `lieu` = one step per place, `agent` = one step per agent. Each step shows
 * ONE thing: a kicker, a short title and one card (a chat exchange or a short list). The scene, the
 * agent in focus and the camera live in DemoEtapes.astro, matched by order.
 */
const texte = z.string().min(1);
const etape = z.strictObject({
  surtitre: texte,
  titre: texte,
  carte: z.union([
    z.strictObject({
      qui: texte,
      texte: texte,
      reponse: z.strictObject({ qui: texte, texte: texte }),
    }),
    z.strictObject({ lignes: z.array(z.strictObject({ agent: texte, texte: texte })).min(1) }),
  ]),
});

export const schema = z.strictObject({
  titre: texte,
  lieu: z.array(etape).length(3),
  agent: z.array(etape).length(7),
});
