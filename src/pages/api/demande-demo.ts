import type { APIRoute } from 'astro';
import { NOTION_TOKEN, NOTION_DEALS_DB, SLACK_WEBHOOK_DEMANDES } from 'astro:env/server';

/**
 * The pricing form's demo request (/reseaux#tarifs): posted (JSON) the moment the visitor sends
 * it, before the booking, so a request is kept even if no slot is ever picked. It becomes a Lead
 * in the CRM's Deals database (« un nouveau prospect = une ligne dans Deals ») and an alert in
 * Slack; it succeeds if at least one of the two worked. Rendered on demand (a Vercel function).
 *
 * Deals properties written (exact names): « Nom de l’établissement » (title), « Sales Stage »
 * (Lead), « Canal d'acquisition » (Inbound), « Contact rapide — Nom / Fonction / Email /
 * Téléphone », « # Implantations », « Date Entrée Pipeline », « Notes rapides », « Next Step »,
 * « Next Step — Date ».
 * Responses: 200 {ok:true} · 400 {ok:false,error:'invalid'} · 500 {ok:false}.
 */
export const prerender = false;

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const texte = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** The offers of the form, and who each one brings. */
const OFFRES: Record<string, string> = {
  socle: 'Socle (Peep, Owl, Jay, Lark)',
  finch: 'Finch',
  pecker: 'Pecker',
  sparrow: 'Sparrow',
};

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
    ouvertures: texte(body.ouvertures, 40),
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
  const agents = f.agents.map((a) => OFFRES[a]).join(', ');
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const notes = [
    `Formulaire tarifs du site (${f.locale.toUpperCase()}).`,
    `Agents : ${agents}.`,
    f.ouvertures ? `Ouvertures par an : ${f.ouvertures}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const notion = async () => {
    if (!NOTION_TOKEN || !NOTION_DEALS_DB) return false;
    const rt = (content: string) => [{ type: 'text', text: { content } }];
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
          'Nom de l’établissement': { title: rt(f.enseigne) },
          'Sales Stage': { select: { name: 'Lead' } },
          "Canal d'acquisition": { multi_select: [{ name: 'Inbound' }] },
          'Contact rapide — Nom': { rich_text: rt(f.nom) },
          'Contact rapide — Fonction': { rich_text: rt(f.role) },
          'Contact rapide — Email': { email: f.email },
          'Contact rapide — Téléphone': { phone_number: f.telephone },
          '# Implantations': { number: f.etablissements },
          'Date Entrée Pipeline': { date: { start: aujourdhui } },
          'Notes rapides': { rich_text: rt(notes) },
          'Next Step': { rich_text: rt('Démo à caler (vérifier la réservation Cal.com)') },
          'Next Step — Date': { date: { start: aujourdhui } },
        },
      }),
    });
    if (!res.ok) console.error('demande-demo: Notion', res.status, await res.text());
    return res.ok;
  };

  const slack = async () => {
    if (!SLACK_WEBHOOK_DEMANDES) return false;
    const s = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lignes = [
      `*Nouvelle demande de démo* (formulaire tarifs, ${f.locale.toUpperCase()})`,
      `${s(f.enseigne)} · ${f.etablissements} établissement${f.etablissements > 1 ? 's' : ''}`,
      `${s(f.nom)}, ${s(f.role)} · ${s(f.email)} · ${s(f.telephone)}`,
      `Agents : ${s(agents)}`,
      f.ouvertures ? `Ouvertures par an : ${s(f.ouvertures)}` : '',
    ].filter(Boolean);
    const res = await fetch(SLACK_WEBHOOK_DEMANDES, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lignes.join('\n') }),
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
