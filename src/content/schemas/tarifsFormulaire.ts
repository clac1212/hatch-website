import { z } from 'astro/zod';

const txt = z.string().min(1);

/** An agent pictured on an offer card; `id` picks its portrait and its gesture video (/anim/<id>-geste.mp4). */
const agent = z.strictObject({
  id: z.enum(['peep', 'owl', 'jay', 'lark', 'finch', 'pecker', 'sparrow']),
  nom: txt,
  /** Shown under the circle on the core card only. */
  role: txt,
});

/** A selectable offer. The ids are fixed: the component and its scripts hang behaviour on them. */
const offre = <I extends string>(id: I) =>
  z.strictObject({
    id: z.literal(id),
    nom: txt,
    tag: txt,
    texte: txt,
    agents: z.array(agent).min(1),
  });

/** A text field of steps 2 and 3. */
const champ = z.strictObject({ label: txt, placeholder: txt });

/**
 * Copy of the pricing form section (src/content/sections/tarifsFormulaire/{fr,en}.yaml): pick agents,
 * describe the network, leave contact details, then go book a demo slot with the answers attached.
 */
export const schema = z.strictObject({
  titre: txt,
  intro: txt,
  /** Legends of the three steps (fieldsets). */
  etapes: z.strictObject({ agents: txt, reseau: txt, contact: txt }),
  /** Labels of the animation pause button (WCAG 2.2.2), while playing and while paused. */
  pause: z.strictObject({ pause: txt, reprendre: txt }),
  /** The core (checked by default), then Finch, Pecker, Sparrow. */
  offres: z.tuple([offre('socle'), offre('finch'), offre('pecker'), offre('sparrow')]),
  /** Badge on Finch and Pecker: they add to the core. */
  avecSocle: txt,
  /** Shown on the core card while it is locked by Finch or Pecker. */
  requis: txt,
  /** Only shown when Sparrow is checked. The second choice is selected by default. */
  ouvertures: z.strictObject({ question: txt, choix: z.tuple([txt, txt, txt, txt]) }),
  champs: z.strictObject({
    enseigne: champ,
    etablissements: champ,
    nom: champ,
    role: champ,
    email: champ,
    telephone: champ,
  }),
  decisionnaire: txt,
  /** Line next to the submit button, updated live with what is left to fill in. */
  reste: z.strictObject({
    /** Before any input (and without JS). */
    initial: txt,
    /** All three steps complete. */
    pret: txt,
    /** Prefix of the missing-steps list, e.g. "Encore à compléter :". */
    manque: txt,
    /** Word before the step number, e.g. "étape" in "votre réseau (étape 2)". */
    etape: txt,
    noms: z.strictObject({ agents: txt, reseau: txt, contact: txt }),
  }),
  envoi: txt,
  /** The "how it works" aside. */
  deroule: z.strictObject({
    kicker: txt,
    etapes: z.tuple([
      z.strictObject({ titre: txt, texte: txt }),
      z.strictObject({ titre: txt, texte: txt }),
      z.strictObject({ titre: txt, texte: txt }),
    ]),
    mention: txt,
  }),
  /**
   * Line labels of the summary attached to the demo booking (stored in sessionStorage for /demo).
   * Labels carry their own colon, so each locale keeps its typography ("Enseigne :" / "Brand:").
   */
  notes: z.strictObject({
    agents: txt,
    /** Name of the core in the agents list. */
    socle: txt,
    ouvertures: txt,
    enseigne: txt,
    etablissements: txt,
    role: txt,
    telephone: txt,
    decisionnaire: txt,
    oui: txt,
    non: txt,
  }),
});
