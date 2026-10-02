import type { ImageMetadata } from 'astro';
import type { AgentSlug } from '../../content/schemas/agents';
import { cadrage } from '../sections/equipe-cadrage';
import photoPeep from '../../assets/equipe/peep.jpg';
import photoOwl from '../../assets/equipe/owl.jpg';
import photoLark from '../../assets/equipe/lark.jpg';
import photoJay from '../../assets/equipe/jay.jpg';
import photoFinch from '../../assets/equipe/finch.jpg';
import photoPecker from '../../assets/equipe/pecker.jpg';
import photoSparrow from '../../assets/equipe/sparrow.jpg';
import avPeep from '../../assets/hero/agents/peep.webp';
import avOwl from '../../assets/hero/agents/owl.webp';
import avLark from '../../assets/hero/agents/lark.webp';
import avJay from '../../assets/hero/agents/jay.webp';
import avFinch from '../../assets/hero/agents/finch.webp';
import avPecker from '../../assets/hero/agents/pecker.webp';
import avSparrow from '../../assets/hero/agents/sparrow.png';

/**
 * Visuals of an agent outside the home: its mosaic render (the bird at its job, on the render's
 * backdrop colour, framed on its subject by `cadrage`) and its voxel avatar (cards, demo screens).
 */
const photos: Record<AgentSlug, ImageMetadata> = {
  peep: photoPeep,
  owl: photoOwl,
  lark: photoLark,
  jay: photoJay,
  finch: photoFinch,
  pecker: photoPecker,
  sparrow: photoSparrow,
};
export const avatars: Record<AgentSlug, ImageMetadata> = {
  peep: avPeep,
  owl: avOwl,
  lark: avLark,
  jay: avJay,
  finch: avFinch,
  pecker: avPecker,
  sparrow: avSparrow,
};

export function agentPhoto(slug: AgentSlug) {
  const c = cadrage[slug];
  if (!c) throw new Error(`No framing for agent "${slug}" in equipe-cadrage.ts`);
  const [x0, y0, x1, y1] = c.sujet;
  // Centre of the subject, as an object-position.
  const position = `${(((x0 + x1) / 2) * 100).toFixed(1)}% ${(((y0 + y1) / 2) * 100).toFixed(1)}%`;
  return { src: photos[slug], fond: c.fond, position };
}
