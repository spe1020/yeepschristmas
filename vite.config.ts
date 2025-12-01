import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // IMPORTANT: project is served from /yeepschristmas/ on GitHub Pages
  base: '/yeepschristmas/',

  plugins: [react()],

  build: {
    // default build to "dist" is fine for GitHub Pages
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Keep your test config if you're using Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    onConsoleLog(log) {
      return !log.includes('React Router Future Flag Warning')
    },
    env: {
      DEBUG_PRINT_LIMIT: '0',
    },
  },
})

