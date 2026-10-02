import type { Locale } from '../../i18n/ui';

/** Fills `{key}` placeholders of a content string; a missing key is a build error. */
export function fill(s: string, vars: Record<string, string>) {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => {
    const v = vars[k];
    if (v === undefined) throw new Error(`No value for {${k}} in "${s}"`);
    return v;
  });
}

/** An ISO date (`2026-10-02`) in words: "2 octobre 2026", "October 2, 2026". */
export function longDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}
