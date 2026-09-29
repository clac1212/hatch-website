import type { Locale } from '../i18n/ui';

/**
 * A key figure as displayed: "10 000+" (FR), "10,000+" (EN). Shared by the server render (final value)
 * and the counter animation, so both format identically. The FR thousands separator (narrow no-break
 * space) becomes a plain no-break space, which every font of the site draws.
 */
export function formatFigure(
  value: number,
  prefix: string,
  suffix: string,
  locale: Locale,
): string {
  const n = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US')
    .format(value)
    .replace(/ /g, ' ');
  return prefix + n + suffix;
}
