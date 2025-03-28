import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',  // Ensures Vite looks in the correct folder
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
    proxy: {
      "/api": "https://medicare-3c0t.onrender.com",
    },
  },
})
