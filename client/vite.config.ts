import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Example: React

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:9000', // Proxy API requests during local development
    },
  },
  build: {
    outDir: 'dist', // Output directory for production build
  },
});
