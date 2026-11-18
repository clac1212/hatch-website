#!/usr/bin/env node
/**
 * DS guardrail (CLAUDE.md, « Guardrails »), run by `pnpm build`: fails on raw values in the markup of
 * .astro files, which must come from the design system's tokens instead.
 *
 * Flags: `text-[…px|rem]` font sizes, `rounded-[…]`, `max-w-[…px|rem]`, a raw `#hex` color in a
 * class or style attribute, and `font-bold` on a Fraunces title (`font-display`).
 * A line is allowed when it, or the line directly above, contains `exception` (the named exception
 * of a signature section: `<!-- exception: why -->`, `{/* exception: why *\/}`, `/* exception: why *\/`).
 * Scoped <style> blocks are not checked: they hold the staging of signature sections.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RACINE = new URL('..', import.meta.url).pathname;
const DOSSIER = join(RACINE, 'src');

const REGLES = [
  { nom: 'font size', re: /\btext-\[[\d.]+(px|rem)\]/ },
  { nom: 'radius', re: /\brounded(-[a-z]+)?-\[[^\]]+\]/ },
  { nom: 'width', re: /\bmax-w-\[[\d.]+(px|rem)\]/ },
  { nom: 'hex color', re: /(class|style)=["'{][^"'}]*#[0-9a-fA-F]{3,8}\b|-\[#[0-9a-fA-F]{3,8}\]/ },
  { nom: 'bold Fraunces', re: /font-display[^"'`]*\bfont-bold\b|\bfont-bold\b[^"'`]*font-display/ },
];

const fichiers = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? fichiers(p) : p.endsWith('.astro') ? [p] : [];
  });

const fautes = [];
for (const f of fichiers(DOSSIER)) {
  const lignes = readFileSync(f, 'utf8').split('\n');
  let dansStyle = false;
  lignes.forEach((l, i) => {
    if (/<style[\s>]/.test(l)) dansStyle = true;
    if (dansStyle) {
      if (l.includes('</style>')) dansStyle = false;
      return;
    }
    if (l.includes('exception') || lignes[i - 1]?.includes('exception')) return;
    for (const r of REGLES) {
      const m = l.match(r.re);
      if (m) fautes.push(`${relative(RACINE, f)}:${i + 1}  ${r.nom}: ${m[0]}`);
    }
  });
}

if (fautes.length) {
  console.error(`check:ds — ${fautes.length} raw value(s) outside the design system:\n`);
  console.error(fautes.join('\n'));
  console.error(
    '\nUse a token (CLAUDE.md, « Design system »), or name the exception: a comment containing',
    '« exception » on the line or the line above.',
  );
  process.exit(1);
}
console.log('check:ds — no raw value outside the design system.');
