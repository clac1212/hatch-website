import { z } from 'astro/zod';

/**
 * Clients shown in the scrolling band, in display order. Each id maps to its storefront and logos in
 * src/assets/clients/ (and to its drawn dimensions in Clients.astro), so an unknown id fails the build.
 */
export const clientIds = [
  'nobinobi',
  'pny',
  'la-meulerie',
  'crousty-one',
  'nemesis',
  'afrik-n-fusion',
  'new-school-tacos',
  'burger-and-fries',
  'dkr',
  'chopstix',
  'ponzu',
  'bomaye',
] as const;
export type ClientId = (typeof clientIds)[number];

/** Copy of the "clients" home section (src/content/sections/clients/{fr,en}.yaml). */
export const schema = z.strictObject({
  title: z.string(),
  /** Key figures, counted up from 0 on first sight: `prefix` + formatted `value` + `suffix`. */
  figures: z
    .array(
      z.strictObject({
        prefix: z.string(),
        value: z.int().nonnegative(),
        suffix: z.string(),
        label: z.string(),
      }),
    )
    .length(4),
  band: z.strictObject({
    /** Accessible name of the band (a list of client names for screen readers). */
    label: z.string(),
  }),
  /** `name` is the logo's alt text, read once by screen readers. */
  clients: z.array(z.strictObject({ id: z.enum(clientIds), name: z.string() })).min(1),
});
