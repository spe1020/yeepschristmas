import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  // Site is served at root on yeeps.christmas
  base: '/',

  plugins: [react()],

  build: {
    // default build to "dist"
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

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
