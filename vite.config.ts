import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base must match the GitHub Pages repo path, else every asset 404s.
// https://vite.dev/config/
export default defineConfig({
  base: '/anamcu-van-3d/',
  plugins: [react(), tailwindcss()],
})
