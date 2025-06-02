import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Minimal environment variables
    'process.env': {},
    'import.meta.env': {}
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      onwarn(warning, warn) {
        // Skip circular dependency warnings
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
    },
    target: 'esnext',
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    open: true,
  },
  base: './', // Important for Azure Static Web Apps
});
