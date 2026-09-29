/**
 * Framing of the mosaic photos, per agent (César: "cadre-les proprement").
 * The tiles have very different ratios (portrait on mobile, wide on desktop) and the label covers
 * their bottom, so a single object-position can't work. Each photo is instead scaled and placed so
 * that its subject fits the visible zone above the label (see the <style> of Equipe.astro).
 *
 * - `sujet`: the agent + its props in the render, as fractions of the image [x0, y0, x1, y1].
 * - `fond`: the render's backdrop colour, sampled from its edges (image data, not a brand colour):
 *   the tile is painted with it so it can show more background than the photo has.
 */
export const cadrage: Record<string, { sujet: [number, number, number, number]; fond: string }> = {
  peep: { sujet: [0.13, 0.1, 0.83, 0.8], fond: '#f4e3b9' },
  finch: { sujet: [0.23, 0.15, 0.75, 0.83], fond: '#f8d9cf' },
  owl: { sujet: [0.26, 0.26, 0.78, 0.84], fond: '#d6d6de' },
  jay: { sujet: [0.08, 0.21, 0.93, 0.86], fond: '#d5e1ef' },
  pecker: { sujet: [0.23, 0.15, 0.78, 0.84], fond: '#e2e9d2' },
  lark: { sujet: [0.2, 0.28, 0.85, 0.77], fond: '#eedcc4' },
  sparrow: { sujet: [0.1, 0.23, 0.9, 0.72], fond: '#ebd7ce' },
};
