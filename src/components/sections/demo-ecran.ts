import type { EcranTablette, EcranTelephone } from '../../content/schemas/demo';

/**
 * Beats of the animated screens (seconds from the start of a demo's content), derived from the copy
 * so a longer text stays on screen longer. DemoEcran.astro writes them as `data-t` attributes; the
 * GSAP timeline (demo-motion.ts) places each gesture on its beat. `duree` = content length.
 */

/** Reading time of a line: a short beat to find it, then ~26 characters per second (César 01/10: faster). */
const lecture = (texte: string) => 0.8 + texte.length / 26;

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
  const frappe = 0.7;
  /** Delay before the right option gets tapped, then before the next beat. */
  const reflexion = 1.5;
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
    if ('quiz' in item) {
      const beat = { item, t, choix: t + reflexion };
      t += reflexion + 1.1;
      return beat;
    }
    if (item.de === 'agent') {
      const beat = { item, t: t + frappe, frappe: t };
      t += frappe + lecture(item.texte);
      return beat;
    }
    // Typed at ~35 ms per character, then sent.
    const saisie = 0.3 + item.texte.length * 0.035;
    const beat = { item, t: t + saisie, brouillon: t };
    t += saisie + lecture(item.texte);
    return beat;
  });
  return { fil, frappe, suivi: t, duree: t + 2.6 };
}
