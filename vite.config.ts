import { defineConfig } from 'vite';

export default defineConfig({
  // Base path: '/' for custom domain (samreynolds.org)
  base: '/',

  // Server configuration
  server: {
    port: 5173,
    open: true,
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
    // CSS and JS minification for production
    minify: 'esbuild',
    cssMinify: true,
  },

  // Asset handling
  assetsInclude: ['**/*.png', '**/*.json'],
});
