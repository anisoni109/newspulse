import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For GitHub Pages: use relative paths ('.') so all pages load correctly at any depth
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/sse/updates': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})