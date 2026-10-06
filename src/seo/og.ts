import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/ui';

/** Open Graph / Twitter card size (summary_large_image). */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * A page's share image: either an image of src/assets (cropped to 1200 × 630 at build time), or a
 * file already at that size (path under public/ or absolute URL) with its dimensions.
 */
export type OgImage =
  | { src: ImageMetadata; alt: string }
  | { src: string; alt: string; width: number; height: number };

export interface ResolvedOgImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * The site's share image when a page has none of its own: public/og-image.jpg (FR) and
 * public/og-image-en.jpg (EN), one layout, only the text changes.
 */
export const defaultOgImage = (locale: Locale, alt: string): OgImage => ({
  src: locale === 'en' ? '/og-image-en.jpg' : '/og-image.jpg',
  width: OG_WIDTH,
  height: OG_HEIGHT,
  alt,
});

/** Whether an image of src/assets is large enough to be cropped into a share image. */
export const isOgSized = (img: ImageMetadata) => img.width >= OG_WIDTH && img.height >= OG_HEIGHT;

/** Absolute URL and size of a share image. */
export async function resolveOgImage(image: OgImage, site: URL): Promise<ResolvedOgImage> {
  if ('width' in image) {
    const { src, alt, width, height } = image;
    return { url: new URL(src, site).href, width, height, alt };
  }
  // Astro never upscales: a smaller source would yield a smaller card than the one declared.
  if (!isOgSized(image.src)) {
    throw new Error(`Share image ${image.src.src} is under ${OG_WIDTH} × ${OG_HEIGHT}`);
  }
  const img = await getImage({
    src: image.src,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fit: 'cover',
    position: 'top',
    format: 'jpg',
  });
  return { url: new URL(img.src, site).href, width: OG_WIDTH, height: OG_HEIGHT, alt: image.alt };
}
