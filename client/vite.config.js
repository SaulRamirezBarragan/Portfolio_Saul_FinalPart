import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const { PORT = 3000} = process.env

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    proxy:{
      '/api':{
        target:`http://localhost:${PORT}`,
        changeOrigin: true,
      },
      '/auth': {
        target:`http://localhost:${PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "../dist/app",
  },
})
