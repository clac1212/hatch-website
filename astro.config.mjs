// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.gethatch.io',

  // FR is the default locale, served at "/" (no prefix). EN is served at "/en/...".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Self-hosted at build time. Weights limited to what the DS v4 uses.
  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.fontsource(),
      weights: [600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      name: 'Departure Mono',
      cssVariable: '--font-departure',
      provider: fontProviders.local(),
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/DepartureMono-Regular.woff2'],
            weight: 400,
            style: 'normal',
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // Web Analytics is injected by the Vercel adapter at deploy time (Preview + Production only).
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],
});
