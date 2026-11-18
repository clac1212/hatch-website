import type { APIRoute } from 'astro';
import { NOTION_TOKEN, NOTION_DEALS_DB, SLACK_WEBHOOK_LISTE_ATTENTE } from 'astro:env/server';

/**
 * The pricing form's demo request (/reseaux#tarifs): posted (JSON) the moment the visitor sends
 * it, before the booking, so a request is kept even if no slot is ever picked. It becomes a deal in
 * the CRM's Deals database (CRM Hatch V3), at the Prospection stage, and an alert in the same Slack
 * channel as Robin's waitlist; it succeeds if at least one of the two worked. Rendered on demand
 * (a Vercel function).
 *
 * Deals properties written (exact names): « Nom » (title), « Stage » (Prospection), « Date
 * Prospection », « Produit » (Hatch OS), « Canal source » (Inbound), « Type de deal » (Nouveau
 * client), « Établissements du deal », « Agents add-on » (Finch, Peker, Sparrow), « Ouvertures par
 * an » (the low end of the range picked), « Contact rapide », « Next step », « Next step date ». The
 * whole request is also written in the page body.
 * Responses: 200 {ok:true} · 400 {ok:false,error:'invalid'} · 500 {ok:false}.
 */
export const prerender = false;

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const texte = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** The offers of the form: their name, and their option in « Agents add-on » (the core has none). */
const OFFRES: Record<string, { nom: string; option?: string }> = {
  socle: { nom: 'Socle (Peep, Owl, Jay, Lark)' },
  finch: { nom: 'Finch', option: 'Finch' },
  pecker: { nom: 'Pecker', option: 'Peker' },
  sparrow: { nom: 'Sparrow', option: 'Sparrow' },
};
/** Sparrow's pace of openings, by the index of the choice in the form (`ouvertures.choix`). */
const OUVERTURES = [
  { texte: '1 à 3', min: 1 },
  { texte: '4 à 10', min: 4 },
  { texte: '11 à 25', min: 11 },
  { texte: 'plus de 25', min: 26 },
];

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { ok: false, error: 'invalid' });
  }

  const f = {
    nom: texte(body.nom, 120),
    role: texte(body.role, 120),
    email: texte(body.email, 200).toLowerCase(),
    telephone: texte(body.telephone, 30),
    enseigne: texte(body.enseigne, 120),
    etablissements: Number(body.etablissements),
    agents: Array.isArray(body.agents) ? body.agents.filter((a) => a in OFFRES) : [],
    ouvertures: typeof body.ouvertures === 'number' ? OUVERTURES[body.ouvertures] : undefined,
    locale: body.locale === 'en' ? 'en' : 'fr',
  };
  // The same rules as the form: every field filled, a valid email, a phone of 8 digits or more.
  if (
    !f.nom ||
    !f.role ||
    !f.enseigne ||
    !f.agents.length ||
    !EMAIL.test(f.email) ||
    f.telephone.replace(/\D/g, '').length < 8 ||
    !Number.isInteger(f.etablissements) ||
    f.etablissements < 1
  ) {
    return json(400, { ok: false, error: 'invalid' });
  }
  const agents = f.agents.map((a) => OFFRES[a].nom).join(', ');
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const contact = `${f.nom} · ${f.role} · ${f.email} · ${f.telephone}`;
  /** The request as read by the team: the page body in Notion, the Slack alert. */
  const lignes = [
    `Demande de démo depuis le formulaire tarifs du site (${f.locale.toUpperCase()}), le ${aujourdhui}.`,
    `Contact : ${contact}`,
    `Établissements dans le réseau : ${f.etablissements}`,
    `Agents choisis : ${agents}`,
    f.ouvertures ? `Ouvertures par an : ${f.ouvertures.texte}` : '',
    'Le visiteur a ensuite vu l’agenda Cal.com : vérifier s’il a réservé un créneau.',
  ].filter(Boolean);

  const notion = async () => {
    if (!NOTION_TOKEN || !NOTION_DEALS_DB) return false;
    const rt = (content: string) => [{ type: 'text', text: { content } }];
    const options = f.agents.flatMap((a) => {
      const option = OFFRES[a].option;
      return option ? [{ name: option }] : [];
    });
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DEALS_DB },
        properties: {
          Nom: { title: rt(f.enseigne) },
          Stage: { select: { name: 'Prospection' } },
          'Date Prospection': { date: { start: aujourdhui } },
          Produit: { select: { name: 'Hatch OS' } },
          'Canal source': { select: { name: 'Inbound' } },
          'Type de deal': { select: { name: 'Nouveau client' } },
          'Établissements du deal': { number: f.etablissements },
          'Agents add-on': { multi_select: options },
          ...(f.ouvertures && { 'Ouvertures par an': { number: f.ouvertures.min } }),
          'Contact rapide': { rich_text: rt(contact) },
          'Next step': { rich_text: rt('Caler la démo (vérifier la réservation Cal.com)') },
          'Next step date': { date: { start: aujourdhui } },
        },
        children: lignes.map((l) => ({
          object: 'block',
          type: 'paragraph',
          paragraph: { rich_text: rt(l) },
        })),
      }),
    });
    if (!res.ok) console.error('demande-demo: Notion', res.status, await res.text());
    return res.ok;
  };

  const slack = async () => {
    if (!SLACK_WEBHOOK_LISTE_ATTENTE) return false;
    const s = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const message = [`*Nouvelle demande de démo Hatch OS* · ${s(f.enseigne)}`, ...lignes.map(s)];
    const res = await fetch(SLACK_WEBHOOK_LISTE_ATTENTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message.join('\n') }),
    });
    if (!res.ok) console.error('demande-demo: Slack', res.status);
    return res.ok;
  };

  const [enNotion, enSlack] = await Promise.all([
    notion().catch((e) => (console.error('demande-demo: Notion', e), false)),
    slack().catch((e) => (console.error('demande-demo: Slack', e), false)),
  ]);
  return enNotion || enSlack ? json(200, { ok: true }) : json(500, { ok: false });
};
