import { getImage } from 'astro:assets';
import grain from '../../assets/fonds/orange-grain.jpg';

/**
 * The site's orange, grained (César 10/11): the background of every orange section (`Section`
 * ton="orange") and of the security page's hero. One picture, softened grain, served as WebP; the
 * flat `bg-orange` under it is the fallback while it loads.
 */
export async function fondOrange(): Promise<string> {
  const image = await getImage({ src: grain, format: 'webp', width: 1600, quality: 70 });
  return `background-image:url(${image.src})`;
}
