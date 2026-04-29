// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

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

  adapter: vercel(),
  integrations: [react()],
});
