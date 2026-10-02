// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import { sitemapOptions } from './src/seo/sitemap.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.gethatch.io',
  // One URL form: never a trailing slash (`/conditions`, `/en`), except the root. Canonicals,
  // hreflang, internal links and the sitemap all use it; on Vercel the adapter redirects `/x/` to
  // `/x` (308). Pages are still built as `x/index.html`, which Vercel serves at `/x`.
  trailingSlash: 'never',

  // PostHog project key (public, but kept out of the repo): Vercel env + local `.env`.
  env: {
    schema: {
      PUBLIC_POSTHOG_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },

  // FR is the default locale, served at "/" (no prefix). EN is served at "/en/...".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Self-hosted at build time. Weights limited to what the v4 mockups use.
  fonts: [
    {
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      provider: fontProviders.fontsource(),
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      name: 'Inter',
      cssVariable: '--font-inter',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700],
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
    // GSAP is only reached through a dynamic import (the demo section loads it when it comes near).
    // Pre-bundle it at dev start, or Vite discovers it late, re-optimises, and the page's request for
    // the old bundle fails with "504 Outdated Optimize Dep".
    optimizeDeps: { include: ['gsap'] },
    // Dev twin of the vercel.json rewrites: PostHog through our own `/relais` path (assets first).
    server: {
      proxy: {
        '/relais/static': {
          target: 'https://eu-assets.i.posthog.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/relais/, ''),
        },
        '/relais': {
          target: 'https://eu.i.posthog.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/relais/, ''),
        },
      },
    },
  },

  // Web Analytics is injected by the Vercel adapter at deploy time (Preview + Production only).
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [
    // hreflang alternates (incl. pages whose slugs differ per locale) and git-based lastmod.
    sitemap(sitemapOptions()),
  ],
});
