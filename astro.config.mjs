// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gethatch.io',

  // Native i18n routing — see https://docs.astro.build/en/guides/internationalization/
  // FR is the default locale → served at "/" (no prefix).
  // EN is served at "/en/...".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  // Web Analytics is injected automatically by the Vercel adapter at deploy time.
  // Speed Insights is now handled by the @vercel/speed-insights package.
  // Only active in production deployments (Preview + Production), not local dev.
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],
});
