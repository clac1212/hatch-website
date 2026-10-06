import { getCollection } from 'astro:content';

/** Every Sans Filtre edition, newest first. */
export async function sortedEditions() {
  const editions = await getCollection('sansFiltre');
  return editions.sort((a, b) => b.data.date.localeCompare(a.data.date));
}
