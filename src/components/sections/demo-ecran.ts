import type { EcranTablette, EcranTelephone } from '../../content/schemas/demo';

/**
 * Beats of the animated screens (seconds from the start of a demo's content), derived from the copy
 * so a longer text stays on screen longer. DemoEcran.astro writes them as `data-t` attributes; the
 * GSAP timeline (demo-motion.ts) places each gesture on its beat. `duree` = content length.
 */

/** Reading time of a line: ~1 s to find it, then ~250 ms per word (≈ 22 characters per second). */
const lecture = (texte: string) => 1.2 + texte.length / 22;

export function chronoTablette(e: EcranTablette) {
  const mots = e.question.split(' ');
  const debutMots = 0.9;
  const parMot = 0.24;
  // Listening (waveform) until the last word, then the sheet arrives.
  const reponse = debutMots + mots.length * parMot + 0.7;
  const parEtape = 2.2;
  const etapes = e.etapes.map((_, i) => reponse + 1 + i * parEtape);
  const pied = reponse + 1 + e.etapes.length * parEtape;
  return {
    mots: mots.map((m, i) => ({ m, t: debutMots + i * parMot })),
    debutMots,
    reponse,
    parEtape,
    etapes,
    pied,
    duree: pied + 2.2,
  };
}

export function chronoTelephone(e: EcranTelephone) {
  /** Typing indicator shown before each agent message. */
  const frappe = 1;
  /** Delay before the right option gets tapped, then before the next beat. */
  const reflexion = 2.2;
  let t = 0.5;
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
      t += reflexion + 1.6;
      return beat;
    }
    if (item.de === 'agent') {
      const beat = { item, t: t + frappe, frappe: t };
      t += frappe + lecture(item.texte);
      return beat;
    }
    // Typed at ~50 ms per character, then sent.
    const saisie = 0.5 + item.texte.length * 0.05;
    const beat = { item, t: t + saisie, brouillon: t };
    t += saisie + lecture(item.texte);
    return beat;
  });
  return { fil, frappe, suivi: t, duree: t + 3.2 };
}
