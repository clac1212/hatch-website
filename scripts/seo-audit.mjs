#!/usr/bin/env node
/**
 * Technical SEO audit of the built site: `pnpm build && pnpm seo:audit` (or `node
 * scripts/seo-audit.mjs <dir>`, default `dist`). No dependency: a small HTML tokenizer is enough
 * for the markup Astro emits. Exits with 1 when a check fails.
 *
 * Per page: title (≤ 60 chars, contains "Hatch OS", unique, no double escaping), meta description
 * (120 to 160 chars, ends a sentence, unique), a single <h1>, Open Graph and Twitter tags, the
 * share image (exists, 1200 × 630), JSON-LD (parses, expected types), canonical (absolute,
 * self-referencing, no trailing slash), reciprocal hreflang, internal links (no trailing slash,
 * target built), no bare "Hatch" in visible or accessible text outside the mocked device screens
 * (`.ipad` / `.iphone`). Site-wide: sitemap (URLs, lastmod, alternates = the pages' hreflang),
 * robots.txt, and the Vercel routes (404 status, trailing-slash redirect).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SITE = 'https://www.gethatch.io';
const BRAND = 'Hatch OS';
const dir = process.argv[2] ?? 'dist';

/** JSON-LD types each page must carry, by path. */
const EXPECTED_TYPES = [
  { test: () => true, types: ['Organization'] },
  { test: (p) => p === '/' || p === '/en', types: ['WebSite', 'SoftwareApplication'] },
  {
    test: (p) => /^\/(sans-filtre|en\/unfiltered)\/\d+$/.test(p),
    types: ['Article', 'BreadcrumbList'],
  },
];

// ── Minimal HTML tokenizer ────────────────────────────────────────────────────────────────────
const VOID = new Set('area base br col embed hr img input link meta source track wbr'.split(' '));
const TOKEN =
  /<!--[\s\S]*?-->|<!doctype[^>]*>|<(script|style|template)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>|[^<]+|</gi;
const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

function attrs(src) {
  const out = {};
  for (const m of src.matchAll(ATTR)) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return out;
}

/** Everything the checks need from one page. */
function parse(html) {
  const page = { rawTitle: '', metas: [], links: [], jsonLd: [], h1: 0, text: [], anchors: [] };
  const stack = []; // { name, mock }
  let inBody = false;
  let inTitle = false;
  const inMock = () => stack.some((e) => e.mock);
  for (const m of html.matchAll(TOKEN)) {
    const [tok, rawName, rawAttrs, rawBody, closing, name, tagAttrs, selfClosing] = m;
    if (rawName) {
      const a = attrs(rawAttrs);
      if (rawName.toLowerCase() === 'script' && a.type === 'application/ld+json') {
        page.jsonLd.push(rawBody);
      }
      continue;
    }
    if (name) {
      const tag = name.toLowerCase();
      if (closing) {
        const i = stack.map((e) => e.name).lastIndexOf(tag);
        if (i >= 0) stack.length = i;
        if (tag === 'title') inTitle = false;
        continue;
      }
      const a = attrs(tagAttrs);
      if (tag === 'body') inBody = true;
      if (tag === 'title') inTitle = true;
      if (tag === 'meta') page.metas.push(a);
      if (tag === 'link') page.links.push(a);
      if (tag === 'h1') page.h1++;
      if (tag === 'a' && a.href !== undefined) page.anchors.push(a.href);
      const classes = (a.class ?? '').split(/\s+/);
      const mock = classes.includes('ipad') || classes.includes('iphone');
      if (inBody && !mock && !inMock()) {
        for (const k of ['alt', 'aria-label', 'title']) if (a[k]) page.text.push(a[k]);
      }
      if (!VOID.has(tag) && !selfClosing) stack.push({ name: tag, mock });
      continue;
    }
    if (tok.startsWith('<!')) continue;
    if (inTitle) page.rawTitle += tok;
    else if (inBody && !inMock()) page.text.push(decode(tok));
  }
  page.title = decode(page.rawTitle).trim();
  return page;
}

// ── Helpers ───────────────────────────────────────────────────────────────────────────────────
const errors = [];
const warnings = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);

function walk(d) {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** `dist/en/terms/index.html` → `/en/terms`. */
const pathOf = (file) => {
  const rel = relative(dir, file).split('\\').join('/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
};
const urlOf = (path) => (path === '/' ? `${SITE}/` : `${SITE}${path}`);
/** Site URL or root-relative href → built file, if any. */
function fileOf(href) {
  let path = href.startsWith(SITE) ? href.slice(SITE.length) || '/' : href;
  path = decodeURIComponent(path.split('#')[0].split('?')[0]);
  if (path === '' || path === '/') return join(dir, 'index.html');
  const candidates = [join(dir, path), join(dir, path, 'index.html'), join(dir, `${path}.html`)];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile());
}

/** Pixel size of a PNG or JPEG. */
function imageSize(file) {
  const b = readFileSync(file);
  if (b.readUInt32BE(0) === 0x89504e47)
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return undefined;
}

const meta = (page, key) => page.metas.find((m) => m.property === key || m.name === key)?.content;
const alternatesOf = (page) =>
  Object.fromEntries(
    page.links.filter((l) => l.rel === 'alternate' && l.hreflang).map((l) => [l.hreflang, l.href]),
  );
const sameMap = (a, b) =>
  Object.keys(a).length === Object.keys(b).length && Object.keys(a).every((k) => a[k] === b[k]);
const BARE = /\bHatch\b(?![\s\u00a0]*OS\b)/g;

// ── Pages ─────────────────────────────────────────────────────────────────────────────────────
if (!existsSync(dir)) {
  console.error(`No ${dir}/ directory: run \`pnpm build\` first.`);
  process.exit(1);
}
const files = walk(dir).filter((f) => f.endsWith('.html'));
const pages = new Map(files.map((f) => [pathOf(f), parse(readFileSync(f, 'utf8'))]));
const rows = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

for (const [path, page] of pages) {
  const noindex = /noindex/.test(meta(page, 'robots') ?? '');

  // Title
  if (!page.title) fail(path, 'no <title>');
  if (page.title.length > 60) fail(path, `title is ${page.title.length} chars (max 60)`);
  if (!page.title.includes(BRAND)) fail(path, `title lacks "${BRAND}"`);
  if (/&amp;amp;|&amp;#|&amp;[a-z]+;/i.test(page.rawTitle) || page.title.includes('&amp;')) {
    fail(path, 'title is double-escaped');
  }
  if (seenTitles.has(page.title)) fail(path, `title also used by ${seenTitles.get(page.title)}`);
  seenTitles.set(page.title, path);

  // Description
  const description = meta(page, 'description') ?? '';
  if (description.length < 120 || description.length > 160) {
    fail(path, `description is ${description.length} chars (120 to 160)`);
  }
  if (!/[.!?…]$/.test(description)) fail(path, 'description does not end a sentence');
  if (seenDescriptions.has(description)) {
    fail(path, `description also used by ${seenDescriptions.get(description)}`);
  }
  seenDescriptions.set(description, path);

  // Headings
  if (page.h1 !== 1) fail(path, `${page.h1} <h1> (expected 1)`);

  // Canonical + hreflang
  const canonicals = page.links.filter((l) => l.rel === 'canonical').map((l) => l.href);
  const alternates = alternatesOf(page);
  if (noindex) {
    if (canonicals.length) fail(path, 'noindex page has a canonical');
  } else {
    if (canonicals.length !== 1) fail(path, `${canonicals.length} canonical links`);
    else if (canonicals[0] !== urlOf(path))
      fail(path, `canonical ${canonicals[0]} ≠ ${urlOf(path)}`);
    for (const k of ['fr', 'en', 'x-default']) if (!alternates[k]) fail(path, `no hreflang ${k}`);
    const lang = path === '/en' || path.startsWith('/en/') ? 'en' : 'fr';
    if (alternates[lang] !== urlOf(path)) fail(path, `hreflang ${lang} is not the page itself`);
    if (alternates['x-default'] !== alternates.fr) fail(path, 'x-default is not the French page');
    for (const k of ['fr', 'en']) {
      const target = alternates[k];
      if (!target) continue;
      if (!target.startsWith(SITE) || /.\/$/.test(target.slice(SITE.length))) {
        fail(path, `hreflang ${k} ${target} is not a canonical URL`);
      }
      const other = pages.get(target.slice(SITE.length) || '/');
      if (!other) fail(path, `hreflang ${k} → ${target} was not built`);
      else if (!sameMap(alternatesOf(other), alternates)) {
        fail(path, `hreflang not reciprocal with ${target}`);
      }
    }
  }

  // Open Graph + Twitter
  const required = [
    'og:site_name',
    'og:type',
    'og:title',
    'og:description',
    'og:locale',
    'og:locale:alternate',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:image:alt',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ];
  if (!noindex) required.push('og:url');
  for (const k of required) if (!meta(page, k)) fail(path, `no ${k}`);
  if (meta(page, 'og:site_name') !== BRAND) fail(path, `og:site_name is not "${BRAND}"`);
  if (meta(page, 'twitter:card') !== 'summary_large_image')
    fail(path, 'twitter:card is not summary_large_image');
  if (!noindex && meta(page, 'og:url') !== canonicals[0]) fail(path, 'og:url ≠ canonical');
  const ogImage = meta(page, 'og:image') ?? '';
  if (!ogImage.startsWith(`${SITE}/`))
    fail(path, `og:image ${ogImage} is not an absolute site URL`);
  else {
    const file = fileOf(ogImage);
    const size = file && imageSize(file);
    if (!file) fail(path, `og:image ${ogImage} was not built`);
    else if (!size || size.width !== 1200 || size.height !== 630) {
      fail(
        path,
        `og:image is ${size ? `${size.width} × ${size.height}` : 'unreadable'}, not 1200 × 630`,
      );
    }
    if (meta(page, 'og:image:width') !== '1200' || meta(page, 'og:image:height') !== '630') {
      fail(path, 'og:image:width/height are not 1200 × 630');
    }
  }
  if (meta(page, 'twitter:image') !== ogImage) fail(path, 'twitter:image ≠ og:image');

  // JSON-LD
  const types = [];
  for (const raw of page.jsonLd) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      fail(path, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    if (raw.includes('aggregateRating')) fail(path, 'JSON-LD has an aggregateRating');
    for (const node of data['@graph'] ?? [data]) {
      types.push(node['@type']);
      if (node['@type'] === 'Organization' && node.logo?.url && !fileOf(node.logo.url)) {
        fail(path, `Organization logo ${node.logo.url} was not built`);
      }
    }
  }
  for (const { test, types: expected } of EXPECTED_TYPES) {
    if (!test(path)) continue;
    for (const t of expected) if (!types.includes(t)) fail(path, `no ${t} JSON-LD`);
  }

  // Internal links
  for (const href of page.anchors) {
    const internal = href.startsWith(SITE) || (href.startsWith('/') && !href.startsWith('//'));
    if (!internal) continue;
    const bare = (href.startsWith(SITE) ? href.slice(SITE.length) : href).split(/[?#]/)[0];
    if (/.\/$/.test(bare)) fail(path, `link ${href} has a trailing slash`);
    else if (bare && !fileOf(bare)) fail(path, `link ${href} → nothing built`);
  }

  // Brand: "Hatch OS", never "Hatch" alone (mocked app screens excepted)
  const bare = page.text.join(' ').match(BARE);
  if (bare) {
    const text = page.text.join(' ');
    const at = [...text.matchAll(BARE)].map(
      (m) => `"…${text.slice(Math.max(0, m.index - 30), m.index + 20).trim()}…"`,
    );
    fail(path, `bare "Hatch" ×${bare.length}: ${at.join(', ')}`);
  }

  rows.push({
    path,
    title: page.title.length,
    desc: description.length,
    h1: page.h1,
    jsonLd: types.join('+'),
    index: noindex ? 'noindex' : 'index',
  });
}

// ── Sitemap ───────────────────────────────────────────────────────────────────────────────────
const indexFile = join(dir, 'sitemap-index.xml');
const sitemapUrls = new Set();
let withLastmod = 0;
if (!existsSync(indexFile)) fail('sitemap', 'no sitemap-index.xml');
else {
  const xmlFiles = [...readFileSync(indexFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1],
  );
  for (const xmlUrl of xmlFiles) {
    if (!xmlUrl.startsWith(`${SITE}/`)) fail('sitemap', `index lists ${xmlUrl} (not on ${SITE})`);
    const file = fileOf(xmlUrl);
    if (!file) {
      fail('sitemap', `${xmlUrl} was not built`);
      continue;
    }
    for (const [, body] of readFileSync(file, 'utf8').matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1] ?? '';
      const path = loc.slice(SITE.length) || '/';
      sitemapUrls.add(path);
      if (/.\/$/.test(path)) fail('sitemap', `${loc} has a trailing slash`);
      const page = pages.get(path);
      if (!page) {
        fail('sitemap', `${loc} was not built`);
        continue;
      }
      if (/<lastmod>/.test(body)) withLastmod++;
      else warn('sitemap', `${loc} has no lastmod`);
      const links = Object.fromEntries(
        [...body.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"\/>/g)].map(
          (m) => [m[1], m[2]],
        ),
      );
      if (!sameMap(links, alternatesOf(page)))
        fail('sitemap', `${loc}: alternates ≠ page hreflang`);
    }
  }
  for (const [path, page] of pages) {
    const noindex = /noindex/.test(meta(page, 'robots') ?? '');
    if (!noindex && !sitemapUrls.has(path)) fail('sitemap', `${path} is missing`);
    if (noindex && sitemapUrls.has(path)) fail('sitemap', `${path} is noindex but listed`);
  }
}

// ── robots.txt ────────────────────────────────────────────────────────────────────────────────
const robotsFile = join(dir, 'robots.txt');
if (!existsSync(robotsFile)) fail('robots.txt', 'missing');
else {
  const robots = readFileSync(robotsFile, 'utf8');
  if (!robots.includes(`Sitemap: ${SITE}/sitemap-index.xml`))
    fail('robots.txt', `no Sitemap: ${SITE}/sitemap-index.xml`);
  if (/^Disallow:\s*\/\s*$/m.test(robots)) fail('robots.txt', 'Disallow: / blocks crawlers');
}

// ── Vercel routes ─────────────────────────────────────────────────────────────────────────────
const vercelNotes = [];
const vercelConfig = '.vercel/output/config.json';
if (existsSync(vercelConfig)) {
  const { routes = [] } = JSON.parse(readFileSync(vercelConfig, 'utf8'));
  const notFound = routes.find((r) => r.status === 404);
  if (!notFound) fail('vercel', 'no 404 route');
  else if (!existsSync(join('.vercel/output/static', notFound.dest)))
    fail('vercel', `${notFound.dest} missing`);
  else vercelNotes.push(`unknown URLs → ${notFound.dest} with status 404`);
  const slash = routes.find((r) => r.src === '^/(.*)/$' && r.status === 308);
  if (!slash) fail('vercel', 'no /x/ → /x redirect');
  else vercelNotes.push(`/x/ → ${slash.headers.Location.replace('$1', 'x')} (308)`);
}

// ── Report ────────────────────────────────────────────────────────────────────────────────────
rows.sort((a, b) => a.path.localeCompare(b.path));
const pad = (s, n) => String(s).padEnd(n);
console.log(`SEO audit of ${dir}/: ${rows.length} pages\n`);
console.log(
  `${pad('page', 26)}${pad('title', 7)}${pad('desc', 6)}${pad('h1', 4)}${pad('robots', 9)}JSON-LD`,
);
for (const r of rows) {
  console.log(
    `${pad(r.path, 26)}${pad(r.title, 7)}${pad(r.desc, 6)}${pad(r.h1, 4)}${pad(r.index, 9)}${r.jsonLd}`,
  );
}
console.log(`\nsitemap: ${sitemapUrls.size} URLs, ${withLastmod} with lastmod`);
for (const n of vercelNotes) console.log(`vercel: ${n}`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`);
if (errors.length) {
  console.log(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('\nAll checks passed.');
