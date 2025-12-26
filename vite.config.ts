import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy toutes les routes API vers le backend
      '^/(auth|offers|contact|preinscription|documents|billing|invoices|jobs|students|instructors|vehicles|availability|lessons|calendar|lesson-requests|skills|crm|settings|exams|health)': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        ws: true, // Pour WebSocket si nécessaire
      },
      // Proxy pour Socket.IO
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        ws: true, // WebSocket pour Socket.IO
        cookieDomainRewrite: 'localhost',
      },
    },
  },
})
