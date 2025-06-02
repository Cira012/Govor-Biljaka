import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Only expose specific environment variables that start with VITE_
    'import.meta.env': Object.entries(process.env).reduce((acc, [key, val]) => {
      if (key.startsWith('VITE_')) {
        acc[key] = val;
      }
      return acc;
    }, {})
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3000,
    open: true,
  },
  base: './', // This is important for Azure Static Web Apps
});
