import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['turkey-map-react'],
  },
  build: {
    commonjsOptions: {
      include: [/turkey-map-react/, /node_modules/],
    },
  },
});
