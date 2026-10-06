import type {
  EcranFormation,
  EcranTableau,
  EcranTablette,
  EcranTelephone,
} from '../../content/schemas/demo';

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
  let t = 0.3;
  /**
   * `frappe` = typing indicator (agent message); `brouillon` = the team member types the reply in
   * the input bar before sending it.
   */
  type Beat = {
    item: EcranTelephone['fil'][number];
    t: number;
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
 * Hatch's training app (EcranFormation): the reading page fills in, a tap on "Continue"; each
 * question slides in, the right option is tapped, its feedback opens, "Continue" again; the last tap
 * passes the training. César 02/10: no dead time, just long enough to catch each line.
 */
export function chronoFormation(e: EcranFormation) {
  /** From the finger touching the button (or an option) to the screen answering it. */
  const reaction = 0.25;
  /** Reading page: title, then each line, then the key point box. */
  const lecture = 0.2;
  const retenir = lecture + 0.15 * (e.lecture.lignes.length + 1) + 0.2;
  // The visitor catches the title and the key point; the lines are scanned, not read.
  let t = retenir + 0.9 + (e.lecture.titre.length + e.lecture.retenir.texte.length) / 70;
  /** `taps[i]` = "Continue" tapped on page i (the last one passes the training). */
  const taps = [t];
  const questions = e.questions.map((q) => {
    const debut = t + reaction;
    const choix = debut + 0.7 + q.question.length / 60;
    const retour = choix + reaction;
    t = retour + 0.6 + q.retour.length / 60;
    taps.push(t);
    return { t: debut, choix, retour };
  });
  const fin = t + reaction;
  const suivi = fin + 1.3;
  return { lecture, retenir, taps, questions, fin, suivi, duree: suivi + 2.4 };
}

/**
 * Head-office dashboard (EcranTableau): the agent's line, the card resolving out of a skeleton,
 * then each block plays its gesture in turn, for a length that suits it.
 */
const DUREE_BLOC: Record<EcranTableau['blocs'][number]['type'], number> = {
  chiffres: 2.6,
  alerte: 2.2,
  edition: 6,
  score: 2.2,
  plan: 0,
};
export function chronoTableau(e: EcranTableau) {
  // A request first, if any (read before the agent answers), then the agent's line.
  const demande = 0.4;
  const intro = e.demande ? demande + 0.8 + lecture(e.demande.texte) * 0.7 : 0.4;
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
  return { demande, intro, carte, resolu, blocs, duree: t + 1.8 };
}
