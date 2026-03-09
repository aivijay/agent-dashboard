import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Agent Dashboard API (port 18790)
      '/agent-api': {
        target: 'http://127.0.0.1:18790',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent-api/, '')
      }
    }
  }
})
