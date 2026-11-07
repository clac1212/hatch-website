import type { APIRoute } from 'astro';
import {
  NOTION_TOKEN,
  NOTION_LISTE_ATTENTE_DB,
  SLACK_WEBHOOK_LISTE_ATTENTE,
} from 'astro:env/server';

/**
 * Robin's beta waitlist: the form of /robin and /en/robin posts here (JSON). Each sign-up becomes a
 * row of a Notion database and an alert in a Slack channel; it succeeds if at least one of the two
 * worked. Rendered on demand (a Vercel function), the rest of the site stays static.
 *
 * Notion database properties (exact names): « Nom » (title), « Prénom » (text), « Restaurant »
 * (text), « Site web » (URL), « WhatsApp » (phone), « Email » (email), « Langue » (select: fr, en).
 * Responses: 200 {ok:true} · 400 {ok:false,error:'invalid'} · 500 {ok:false}.
 */
export const prerender = false;

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const texte = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL = /^\+?[\d\s().-]{6,20}$/;

export const POST: APIRoute = async ({ request, redirect }) => {
  // The page posts JSON; without JavaScript the browser sends the form itself, and gets sent back
  // to the waitlist section of the Robin page instead of a JSON response.
  const formulaire = !(request.headers.get('content-type') ?? '').includes('application/json');
  const retour = (ok: boolean) => {
    const page = body?.locale === 'en' ? '/en/robin' : '/robin';
    return redirect(`${page}?inscription=${ok ? 'ok' : 'erreur'}#beta`, 303);
  };
  let body: Record<string, unknown> = {};
  try {
    body = formulaire ? Object.fromEntries(await request.formData()) : await request.json();
  } catch {
    return formulaire ? retour(false) : json(400, { ok: false, error: 'invalid' });
  }
  // Honeypot: a bot filled the hidden field. Pretend it worked, record nothing.
  if (texte(body.website)) return formulaire ? retour(true) : json(200, { ok: true });

  const f = {
    prenom: texte(body.prenom, 80),
    nom: texte(body.nom, 80),
    restaurant: texte(body.restaurant, 120),
    site: texte(body.site, 300),
    whatsapp: texte(body.whatsapp, 30),
    email: texte(body.email, 200).toLowerCase(),
    locale: body.locale === 'en' ? 'en' : 'fr',
  };
  if (!f.prenom || !f.nom || !f.restaurant || !EMAIL.test(f.email) || !TEL.test(f.whatsapp)) {
    return formulaire ? retour(false) : json(400, { ok: false, error: 'invalid' });
  }
  const site = f.site && !/^https?:\/\//i.test(f.site) ? `https://${f.site}` : f.site;

  const notion = async () => {
    if (!NOTION_TOKEN || !NOTION_LISTE_ATTENTE_DB) return false;
    const rt = (content: string) => [{ type: 'text', text: { content } }];
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_LISTE_ATTENTE_DB },
        properties: {
          Nom: { title: rt(`${f.prenom} ${f.nom}`) },
          Prénom: { rich_text: rt(f.prenom) },
          Restaurant: { rich_text: rt(f.restaurant) },
          'Site web': { url: site || null },
          WhatsApp: { phone_number: f.whatsapp },
          Email: { email: f.email },
          Langue: { select: { name: f.locale } },
        },
      }),
    });
    if (!res.ok) console.error('liste-attente: Notion', res.status, await res.text());
    return res.ok;
  };

  const slack = async () => {
    if (!SLACK_WEBHOOK_LISTE_ATTENTE) return false;
    const lignes = [
      `*Nouvelle inscription Robin* (${f.locale.toUpperCase()})`,
      `${f.prenom} ${f.nom} · ${f.restaurant}`,
      `WhatsApp : ${f.whatsapp} · ${f.email}`,
      site ? `Site : ${site}` : '',
    ].filter(Boolean);
    const res = await fetch(SLACK_WEBHOOK_LISTE_ATTENTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: lignes.join('\n') }),
    });
    if (!res.ok) console.error('liste-attente: Slack', res.status);
    return res.ok;
  };

  const [enNotion, enSlack] = await Promise.all([
    notion().catch((e) => (console.error('liste-attente: Notion', e), false)),
    slack().catch((e) => (console.error('liste-attente: Slack', e), false)),
  ]);
  const ok = enNotion || enSlack;
  if (formulaire) return retour(ok);
  return ok ? json(200, { ok: true }) : json(500, { ok: false });
};
