import type { EcranTableau, EcranTablette, EcranTelephone } from '../../content/schemas/demo';

/**
 * Beats of the animated screens (seconds from the start of a demo's content), derived from the copy
 * so a longer text stays on screen longer. DemoEcran.astro writes them as `data-t` attributes; the
 * GSAP timeline (demo-motion.ts) places each gesture on its beat. `duree` = content length.
 */

/**
 * Pause after a line before the next one. César 01/10: the thread must flow, one message right
 * after another, no waiting; the visitor rereads the thread, it stays on screen.
 */
const lecture = (texte: string) => 0.35 + texte.length / 45;

export function chronoTablette(e: EcranTablette) {
  const mots = e.question.split(' ');
  const debutMots = 0.9;
  const parMot = 0.24;
  // Listening (waveform) until the last word.
  const reponse = debutMots + mots.length * parMot + 0.7;
  // Then Owl builds the answer as UI (skeleton, then the sheet resolves) and starts speaking it.
  const prepare = reponse + 0.2;
  const resolu = prepare + 1.3;
  const voix = resolu + 0.7;
  /** Each step's visual plays its gesture (keys typed, notes counted, receipt printed). */
  const parEtape = 2.9;
  const etapes = e.etapes.map((_, i) => voix + 0.3 + i * parEtape);
  const finVoix = voix + 0.3 + e.etapes.length * parEtape;
  return {
    mots: mots.map((m, i) => ({ m, t: debutMots + i * parMot })),
    debutMots,
    reponse,
    prepare,
    resolu,
    voix,
    parEtape,
    etapes,
    finVoix,
    duree: finVoix + 2,
  };
}

export function chronoTelephone(e: EcranTelephone) {
  /** Typing indicator shown before each agent message. */
  const frappe = 0.5;
  /** Delay before the right option gets tapped, then before the next beat. */
  const reflexion = 1.1;
  let t = 0.3;
  /**
   * `choix` = when the right option is tapped (quiz); `frappe` = typing indicator (agent message);
   * `brouillon` = the team member types the reply in the input bar before sending it.
   */
  type Beat = {
    item: EcranTelephone['fil'][number];
    t: number;
    choix?: number;
    frappe?: number;
    brouillon?: number;
  };
  const fil = e.fil.map((item): Beat => {
    if ('document' in item) {
      // The agent's attachment lands right after its message.
      const beat = { item, t: t - 0.2 };
      t += 0.9;
      return beat;
    }
    if ('quiz' in item) {
      const beat = { item, t, choix: t + reflexion };
      t += reflexion + 0.8;
      return beat;
    }
    if (item.de === 'agent') {
      const beat = { item, t: t + frappe, frappe: t };
      t += frappe + lecture(item.texte);
      return beat;
    }
    // Typed at ~25 ms per character, then sent.
    const saisie = 0.2 + item.texte.length * 0.025;
    const beat = { item, t: t + saisie, brouillon: t };
    t += saisie + lecture(item.texte);
    return beat;
  });
  return { fil, frappe, suivi: t, duree: t + 2.4 };
}

/**
 * Head-office dashboard (EcranTableau): the agent's line, the card resolving out of a skeleton,
 * then each block plays its gesture in turn, for a length that suits it.
 */
const DUREE_BLOC: Record<EcranTableau['blocs'][number]['type'], number> = {
  chiffres: 2.6,
  alerte: 2.2,
  edition: 4.6,
  diffusion: 3,
  score: 2.2,
  plan: 0,
};
export function chronoTableau(e: EcranTableau) {
  const intro = 0.4;
  const carte = intro + 0.9 + lecture(e.intro) * 0.6;
  const resolu = carte + 1.1;
  let t = resolu + 0.5;
  const blocs = e.blocs.map((b) => {
    // The plan: ~1.8 s of thinking, then each action typed.
    const d = b.type === 'plan' ? 2.2 + b.actions.length * 1.7 : DUREE_BLOC[b.type];
    const beat = { t, d };
    t += d;
    return beat;
  });
  return { intro, carte, resolu, blocs, duree: t + 1.8 };
}
