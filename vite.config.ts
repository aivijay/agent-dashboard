import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // OpenClaw Gateway (port 18789)
      '/api': {
        target: 'http://127.0.0.1:18789',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
      '/health': {
        target: 'http://127.0.0.1:18789',
        changeOrigin: true
      },
      // Agent Dashboard API (port 18790)
      '/agent-api': {
        target: 'http://127.0.0.1:18790',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/agent-api/, '')
      }
    }
  }
})
