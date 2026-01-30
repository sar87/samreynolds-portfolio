import { defineConfig } from 'vite';

export default defineConfig({
  // Server configuration
  server: {
    port: 5173,
    open: true, // Auto-open browser
  },

  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Target modern browsers
    target: 'es2022',
  },

  // Asset handling (for sprites, etc.)
  assetsInclude: ['**/*.png', '**/*.json'],
});
