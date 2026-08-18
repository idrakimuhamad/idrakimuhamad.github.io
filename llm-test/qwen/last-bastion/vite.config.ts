import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // NOTE: the deployed site is copied to this folder's root (see .gitignore),
  // so the build must read its template from a separate file — never from
  // index.html at the root, which holds the BUILT site.
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1500,
    rollupOptions: { input: { index: 'template.html' } },
  },
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
});
