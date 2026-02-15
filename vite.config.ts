import { defineConfig } from 'vite';

export default defineConfig({
  // Base path: '/' for local dev, '/Website/' for GitHub Pages
  base: process.env.GITHUB_PAGES ? '/Website/' : '/',

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
