import { z } from 'astro/zod';

const texte = z.string().min(1);

/** One space of the site, as a card on the home page: the audience, the promise, the way in. */
const espace = z.strictObject({
  /** Audience of the space (pixel-font kicker). */
  kicker: texte,
  titre: texte,
  texte,
  /** Label of the card's call to action (the whole card is the link). */
  cta: texte,
  /** Alt text of the card's voxel illustration. */
  alt: texte,
});

/**
 * Copy of the home page (src/content/sections/accueil/{fr,en}.yaml), the crossroads between the
 * independents' space (Robin) and the networks' space. Rendered by src/views/AccueilPage.astro.
 */
export const schema = z.strictObject({
  /**
   * The rebus title: `debut`, the agent's avatar in a circle, `liaison`, then one of `mots` that
   * rotates word by word. The full sentence is `debut liaison texte` (also read by screen readers).
   */
  titre: z.strictObject({ debut: texte, liaison: texte }),
  /**
   * One task per agent, taken from its pitch (src/content/agents/<locale>/*.md; Robin: Notion), in
   * rotation order. `agent` picks the avatar loop (public/anim/<agent>.mp4), its poster and the 3D
   * icon closing the sentence.
   */
  mots: z
    .array(
      z.strictObject({
        agent: z.enum(['peep', 'owl', 'jay', 'lark', 'finch', 'pecker', 'sparrow', 'robin']),
        texte,
      }),
    )
    .min(1),
  /** Line under the title: who the site is for. */
  lead: texte,
  /** The two doors: independent restaurant (Robin), network (the agents). */
  espaces: z.strictObject({ independant: espace, reseau: espace }),
  /** UI strings of the Security block (src/components/sections/SecuriteLivre.astro). */
  securite: z.strictObject({
    /** Link to the full Security page. */
    lien: texte,
    /** aria-labels of the arrows that turn the pages. */
    precedent: texte,
    suivant: texte,
  }),
});
