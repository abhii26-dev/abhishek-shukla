// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages: site + base. Tailwind is via @tailwindcss/vite (Astro 6; @astrojs/tailwind does not support Astro 6 yet).
export default defineConfig({
  site: 'https://abhii26-dev.github.io',
  base: '/abhishek-shukla',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
