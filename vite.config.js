import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // The React plugin (fast refresh) is only needed for the dev server and build
  plugins: process.env.VITEST ? [] : [react()],
  esbuild: process.env.VITEST ? { jsx: 'automatic' } : undefined,
  test: {
    environment: 'jsdom',
  },
})
