import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import type { SitemapItem, SitemapOptions } from '@astrojs/sitemap';
import { otherLocale, routes, type Locale } from '../i18n/ui';

/**
 * Options of @astrojs/sitemap (imported by astro.config.mjs, so plain Node: no `astro:` modules).
 *
 * - hreflang alternates: each URL is paired with its counterpart in the other locale through the
 *   `routes` map of src/i18n/ui.ts, so pairs whose slugs differ (`/securite` ↔ `/en/security`)
 *   are linked too, plus `x-default` (French), exactly as the <link rel="alternate"> of <Base>.
 *   Pages below a route (`/sans-filtre/002`) keep their tail; any other page pairs `/x` with `/en/x`.
 *   An alternate is only written when the counterpart page was built.
 * - `lastmod`: date of the last commit touching the page's own sources (content, view), never the
 *   build time. Unknown when git has no full history for those files (shallow clone whose boundary
 *   commit is the result, no .git at all): `lastmod` is then omitted rather than made up.
 */

type RouteKey = keyof typeof routes;

/** Sources of the per-entry pages (`entryRoutes` of src/i18n/ui.ts), by their first segment. */
const ENTRY_SOURCES: Record<string, (id: string, l: Locale) => string[]> = {
  agents: (slug, l) => [`src/content/agents/${l}/${slug}.md`, 'src/views/AgentPage.astro'],
};

/** Sources of each route's page, per locale. A route without an entry gets no lastmod. */
const SOURCES: Partial<Record<RouteKey, (l: Locale) => string[]>> = {
  home: (l) => [
    'src/views/HomePage.astro',
    `src/content/home/${l}.yaml`,
    'src/content/sections',
    'src/components/sections',
  ],
  demo: (l) => ['src/views/DemoPage.astro', `src/content/pages/demo/${l}.yaml`],
  security: (l) => ['src/views/SecurityPage.astro', `src/content/pages/security/${l}.yaml`],
  terms: (l) => [`src/content/legal/${l}/terms.md`],
  privacy: (l) => [`src/content/legal/${l}/privacy.md`],
  sansFiltre: (l) => [
    'src/views/SansFiltrePage.astro',
    'src/components/pages/SansFiltreEdition.astro',
    `src/content/pages/sansFiltre/${l}.yaml`,
    'src/content/sans-filtre',
  ],
};

/** Sources of a page below a route (`tail`: what follows the route's path, e.g. `002`). */
const CHILD_SOURCES: Partial<Record<RouteKey, (tail: string) => string[]>> = {
  sansFiltre: (edition) => {
    const dir = 'src/content/sans-filtre';
    const file = readdirSync(dir).find((f) =>
      new RegExp(`^edition:\\s*['"]?${edition}['"]?\\s*$`, 'm').test(
        readFileSync(`${dir}/${f}`, 'utf8'),
      ),
    );
    return file ? [`${dir}/${file}`, 'src/components/pages/SansFiltreEdition.astro'] : [];
  },
};

const routeEntries = (Object.entries(routes) as [RouteKey, Record<Locale, string>][]).sort(
  (a, b) => b[1].fr.length - a[1].fr.length,
);

const localeOf = (path: string): Locale =>
  path === '/en' || path.startsWith('/en/') ? 'en' : 'fr';

/** Which route a path is (`tail` empty), or lies below. */
function routeOf(path: string): { key?: RouteKey; tail: string } {
  const l = localeOf(path);
  for (const [key, r] of routeEntries) {
    if (r[l] === path) return { key, tail: '' };
  }
  for (const [key, r] of routeEntries) {
    const base = r[l];
    if (base !== routes.home[l] && path.startsWith(`${base}/`)) {
      return { key, tail: path.slice(base.length + 1) };
    }
  }
  return { tail: '' };
}

/** The same page in the other locale. */
export function counterpart(path: string): string {
  const from = localeOf(path);
  const to = otherLocale(from);
  const { key, tail } = routeOf(path);
  if (key) return tail ? `${routes[key][to]}/${tail}` : routes[key][to];
  return from === 'fr' ? `/en${path}` : path.slice('/en'.length);
}

/**
 * Draft entry pages (`brouillon: true` in their content file: agent page block) are served
 * `noindex` by their view and left out of the sitemap until the copy is validated.
 */
function isDraft(path: string): boolean {
  const [, group, id] = path.replace(/^\/en(?=\/)/, '').match(/^\/([^/]+)\/([^/]+)$/) ?? [];
  const file = group && ENTRY_SOURCES[group]?.(id, localeOf(path))[0];
  return !!file && existsSync(file) && /^\s*brouillon:\s*true\b/m.test(readFileSync(file, 'utf8'));
}

function sourcesOf(path: string): string[] {
  const { key, tail } = routeOf(path);
  if (!key) {
    const [, group, id] = path.replace(/^\/en(?=\/)/, '').match(/^\/([^/]+)\/([^/]+)$/) ?? [];
    return (group && ENTRY_SOURCES[group]?.(id, localeOf(path))) || [];
  }
  return (tail ? CHILD_SOURCES[key]?.(tail) : SOURCES[key]?.(localeOf(path))) ?? [];
}

const git = (args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

let shallowCommits: Set<string> | undefined;
/** Boundary commits of a shallow clone: they look like they touch every file. */
function shallowBoundary(): Set<string> {
  if (!shallowCommits) {
    const file = git(['rev-parse', '--git-path', 'shallow']);
    shallowCommits = new Set(existsSync(file) ? readFileSync(file, 'utf8').split(/\s+/) : []);
  }
  return shallowCommits;
}

const dates = new Map<string, string | undefined>();
/** ISO date of the last commit touching any of `paths`, if git knows it. */
function lastCommitDate(paths: string[]): string | undefined {
  const cacheKey = paths.join('\n');
  if (!dates.has(cacheKey)) {
    let date: string | undefined;
    try {
      const [hash, iso] = git(['log', '-1', '--format=%H %cI', '--', ...paths]).split(' ');
      if (hash && !shallowBoundary().has(hash)) date = iso;
    } catch {
      // A build without a repository (e.g. a CLI upload with no .git) is a real case: no lastmod.
    }
    dates.set(cacheKey, date);
  }
  return dates.get(cacheKey);
}

/** `https://x/conditions/` → `https://x/conditions` (the root keeps its slash). */
function withoutSlash(href: string) {
  const url = new URL(href);
  url.pathname = url.pathname.replace(/(.)\/$/, '$1');
  return url.href;
}

export function sitemapOptions(): SitemapOptions {
  // Every URL of the sitemap, collected by `filter`, which the integration runs on the whole list
  // before calling `serialize` on each item. URLs are normalised without a trailing slash and
  // deduplicated (the integration merges the built pages with the route list).
  const built = new Set<string>();
  return {
    filter(page) {
      const url = withoutSlash(page);
      if (built.has(url) || isDraft(new URL(url).pathname)) return false;
      built.add(url);
      return true;
    },
    serialize(item: SitemapItem) {
      if (built.size === 0) throw new Error('sitemap: `serialize` ran before `filter`');
      const url = new URL(withoutSlash(item.url));
      const path = url.pathname;
      const other = counterpart(path);
      const href = (p: string) => new URL(p, url.origin).href;
      const [fr, en] = localeOf(path) === 'fr' ? [path, other] : [other, path];
      const sources = sourcesOf(path);
      return {
        url: url.href,
        lastmod: sources.length ? lastCommitDate(sources) : undefined,
        links: built.has(href(other))
          ? [
              { lang: 'fr', url: href(fr) },
              { lang: 'en', url: href(en) },
              { lang: 'x-default', url: href(fr) },
            ]
          : undefined,
      };
    },
  };
}
