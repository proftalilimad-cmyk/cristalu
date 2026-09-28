import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    // Allow the sandboxed preview host (*.e2b.app) and any future domain.
    allowedHosts: true,
    hmr: { clientPort: 443, protocol: 'wss' },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('react-router')) return 'router'
            if (id.includes('react')) return 'react'
          }
          return undefined
        },
      },
    },
  },
})
