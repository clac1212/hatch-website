import type { EcranTablette, EcranTelephone } from '../../content/schemas/demo';

/**
 * Timelines of the animated screens (seconds from the start of a demo), derived from the copy so a
 * longer text stays on screen longer. Each beat becomes a `--t` delay on its element in DemoEcran.astro;
 * `duree` drives the tab's progress bar and the switch to the next demo.
 */

/** Reading time of a line: a base plus ~30 characters per second. */
const lecture = (texte: string) => 1 + texte.length / 30;

export function chronoTablette(e: EcranTablette) {
  const mots = e.question.split(' ');
  const debutMots = 0.8;
  const parMot = 0.22;
  // Listening (waveform) until the last word, then the sheet arrives.
  const reponse = debutMots + mots.length * parMot + 0.6;
  const parEtape = 1.9;
  const etapes = e.etapes.map((_, i) => reponse + 0.9 + i * parEtape);
  const pied = reponse + 0.9 + e.etapes.length * parEtape;
  return {
    mots: mots.map((m, i) => ({ m, t: debutMots + i * parMot })),
    ecoute: reponse - debutMots,
    reponse,
    parEtape,
    etapes,
    pied,
    duree: pied + 2.4,
  };
}

export function chronoTelephone(e: EcranTelephone) {
  /** Typing indicator shown before each agent message. */
  const frappe = 0.9;
  /** Delay before the right option gets tapped, then before the next beat. */
  const reflexion = 1.8;
  let t = 0.6;
  /** `choix` = when the right option is tapped (quiz); `frappe` = typing indicator (agent message). */
  type Beat = { item: EcranTelephone['fil'][number]; t: number; choix?: number; frappe?: number };
  const fil = e.fil.map((item): Beat => {
    if ('quiz' in item) {
      const beat = { item, t, choix: t + reflexion };
      t += reflexion + 1.4;
      return beat;
    }
    if (item.de === 'agent') {
      const beat = { item, t: t + frappe, frappe: t };
      t += frappe + lecture(item.texte);
      return beat;
    }
    const beat = { item, t };
    t += lecture(item.texte);
    return beat;
  });
  return { fil, frappe, suivi: t, duree: t + 3 };
}
