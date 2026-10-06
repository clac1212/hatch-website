import type { ImageMetadata } from 'astro';
import type { CaseId } from '../../content/schemas/cas';
import meulerieFront from '../../assets/clients/devantures/la-meulerie.png';
import nobinobiFront from '../../assets/clients/devantures/nobinobi.png';
import pnyFront from '../../assets/clients/devantures/pny.png';
import meulerieLogo from '../../assets/cas/logo-la-meulerie-marque.png';
import nobinobiLogo from '../../assets/cas/logo-nobinobi-marque.png';
import pnyLogo from '../../assets/cas/logo-pny-marque.png';

/**
 * Visuals of each customer case on the home shelf (Cas.astro). `logo` = the brand's version for its own colour (La Meulerie white with its
 * orange shadow, Nobinobi its original sticker logo, made for dark), `logoH` = its drawn height in px
 * from lg, so the three marks weigh the same despite their ratios (wide wordmark vs. stacked sticker).
 */
export const casVisuels: Record<
  CaseId,
  { front: ImageMetadata; logo: ImageMetadata; logoH: number; color: string }
> = {
  'la-meulerie': {
    front: meulerieFront,
    logo: meulerieLogo,
    logoH: 26,
    color: 'var(--color-client-meulerie)',
  },
  nobinobi: {
    front: nobinobiFront,
    logo: nobinobiLogo,
    logoH: 52,
    color: 'var(--color-client-nobinobi)',
  },
  pny: { front: pnyFront, logo: pnyLogo, logoH: 34, color: 'var(--color-client-pny)' },
};
