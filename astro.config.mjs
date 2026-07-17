// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

const isVercel = Boolean(process.env.VERCEL);

// https://astro.build/config
export default defineConfig({
  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [tailwind(), react(), tina()],
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: {
      noExternal: ['@tinacms/astro', '@tinacms/bridge'],
    },
  },
});
