import { getEntry, type CollectionKey } from 'astro:content';
import type { Locale } from '../i18n/ui';

type Section = Exclude<
  CollectionKey,
  | 'home'
  | 'agents'
  | 'cases'
  | 'legal'
  | 'sansFiltre'
  | 'demoPage'
  | 'securityPage'
  | 'sansFiltrePage'
  | 'agentPage'
  | 'casePage'
>;

/** Loads a section's copy for a locale; a missing file is a build error, not a silent blank. */
export async function section<S extends Section>(name: S, locale: Locale) {
  const entry = await getEntry(name, locale);
  if (!entry) throw new Error(`Missing src/content/sections/${name}/${locale}.yaml`);
  return entry.data;
}
