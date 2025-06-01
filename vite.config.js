import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Expose all environment variables to your app
      'process.env': env,
      // Also expose VITE_ prefixed variables for backward compatibility
      'import.meta.env': Object.entries(env).reduce((acc, [key, val]) => {
        if (key.startsWith('VITE_')) {
          acc[key] = val
        }
        return acc
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
  }
})
