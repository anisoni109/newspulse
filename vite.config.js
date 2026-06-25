import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // change to '/your-repo-name/' when deploying to GitHub Pages user/organization pages
})
