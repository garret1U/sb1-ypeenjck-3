import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets'
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    open: false
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
