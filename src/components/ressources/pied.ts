import type { ScenePied } from '../Footer.astro';
import { section } from '../../content/section';
import type { Locale } from '../../i18n/ui';
import redaction from '../../assets/footer/redaction.png';
import redactionMobile from '../../assets/footer/redaction-mobile.png';

/** Footer scene of the resources pages: the seven agents in a row, each writing an article (paper, phone,
 * tablet, laptop, desktop), full width above the brand, no list. */
export async function piedRessources(locale: Locale): Promise<ScenePied> {
  const { alt } = (await section('piedDePage', locale)).scenes.ressources;
  return {
    image: redaction,
    alt,
    titre: '',
    liste: [],
    bande: true,
    imageEtroite: redactionMobile,
  };
}
