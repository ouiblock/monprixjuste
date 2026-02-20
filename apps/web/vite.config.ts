import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@monprixjuste/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@monprixjuste/core': path.resolve(__dirname, '../../packages/core/src'),
      '@monprixjuste/immobilier': path.resolve(__dirname, '../../packages/immobilier/src'),
    },
  },
  server: {
    port: 5173,
  },
});
