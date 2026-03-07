import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external hosts (Replit preview)
    port: 5000,
    strictPort: true,

    // Allow Replit preview domains
    allowedHosts: [
      '.replit.dev',
      '.replit.app',
      'localhost'
    ],

    hmr: {
      protocol: 'wss',
      clientPort: 443
    }
  }
})