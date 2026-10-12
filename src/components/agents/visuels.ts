import type { ImageMetadata } from 'astro';
import type { AgentSlug } from '../../content/schemas/agents';
import peep from '../../assets/agents/centre/peep.jpg';
import owl from '../../assets/agents/centre/owl.jpg';
import pecker from '../../assets/agents/centre/pecker.jpg';
import lark from '../../assets/agents/centre/lark.jpg';
import jay from '../../assets/agents/centre/jay.jpg';
import finch from '../../assets/agents/centre/finch.jpg';
import sparrow from '../../assets/agents/centre/sparrow.jpg';

/**
 * The agent pages' own renders (Pencil "Page agent", generated 10/2026): the agent facing you, for
 * the centre tile of its feature wall. `fond` is the render's backdrop colour, which also tints the
 * agent elsewhere on the pages (its "fait seul" card, its avatar squares); `place` is the centre
 * tile's column and row in the six-column wall.
 */
export const centres: Record<
  AgentSlug,
  { src: ImageMetadata; fond: string; place: [number, number] }
> = {
  peep: { src: peep, fond: '#faf1d0', place: [3, 2] },
  owl: { src: owl, fond: '#eeeff4', place: [3, 1] },
  pecker: { src: pecker, fond: '#e9f1dc', place: [3, 2] },
  lark: { src: lark, fond: '#f6eada', place: [3, 1] },
  jay: { src: jay, fond: '#cddeee', place: [3, 2] },
  finch: { src: finch, fond: '#fce3de', place: [3, 2] },
  sparrow: { src: sparrow, fond: '#f2e7e1', place: [3, 2] },
};
