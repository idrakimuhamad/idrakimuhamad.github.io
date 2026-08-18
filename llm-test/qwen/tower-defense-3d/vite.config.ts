import { defineConfig, type Plugin } from 'vite';

/**
 * Dev only: serve template.html at `/`.
 * The root index.html is reserved for the deployed built site (Phase 6),
 * so the dev server's default entry (index.html) doesn't exist until then —
 * without this, `npm run dev` returns a 404 at `/`.
 */
function devIndexFromTemplate(): Plugin {
  return {
    name: 'dev-index-from-template',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = (req.url ?? '').split('?')[0];
        if (url === '/' || url === '/index.html') {
          req.url = '/template.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [devIndexFromTemplate()],
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
