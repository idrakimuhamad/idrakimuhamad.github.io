import { defineConfig } from 'vite';

// base './' makes all asset URLs relative so the built site works from any
// sub-path (e.g. https://<user>.github.io/qwen/cloth-simulation/).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2019',
    // Keep the bundle small and readable; no framework, no libs.
    minify: 'esbuild',
  },
  server: {
    host: true,
    port: 5173,
  },
});
