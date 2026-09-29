/**
 * Framing of the mosaic photos, per agent (César: "cadre-les proprement").
 * The tiles have very different ratios (portrait on mobile, wide on desktop) and the label covers
 * their bottom, so a single object-position can't work. Each photo is instead scaled and placed so
 * that its subject fits the visible zone above the label (see the <style> of Equipe.astro).
 *
 * - `sujet`: the agent + its props in the render, as fractions of the image [x0, y0, x1, y1].
 * - `oiseau`: the bird's body (crest excluded), top and bottom as fractions of the image height: every bird is
 *   drawn at the same height, so the seven look like one team (the renders frame them differently).
 * - `fond`: the render's backdrop colour, averaged over its outer edge (image data, not a brand colour):
 *   the tile is painted with it so it can show more background than the photo has.
 */
export const cadrage: Record<
  string,
  { sujet: [number, number, number, number]; oiseau: [number, number]; fond: string }
> = {
  peep: { sujet: [0.13, 0.1, 0.83, 0.8], oiseau: [0.46, 0.78], fond: '#f2e1b7' },
  finch: { sujet: [0.23, 0.15, 0.75, 0.83], oiseau: [0.34, 0.68], fond: '#f8d8ce' },
  owl: { sujet: [0.26, 0.26, 0.78, 0.84], oiseau: [0.27, 0.58], fond: '#d4d5dd' },
  jay: { sujet: [0.08, 0.21, 0.93, 0.86], oiseau: [0.36, 0.62], fond: '#d3dfef' },
  pecker: { sujet: [0.23, 0.15, 0.78, 0.84], oiseau: [0.17, 0.58], fond: '#e2e8d1' },
  lark: { sujet: [0.2, 0.28, 0.85, 0.77], oiseau: [0.35, 0.6], fond: '#eddbc3' },
  sparrow: { sujet: [0.1, 0.23, 0.9, 0.72], oiseau: [0.5, 0.7], fond: '#ead6cd' },
};
