import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    // Autorise les hôtes de prévisualisation (tunnels, sandboxes)
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: isSsrBuild
        ? undefined
        : {
            // Three.js / drei restent dans un chunk chargé à la demande
            // (imports dynamiques dans `CanvasHost` et les sections 3D).
            manualChunks(id: string) {
              if (!id.includes('node_modules')) return undefined
              if (/[\\/](gsap|framer-motion)[\\/]/.test(id)) return 'motion'
              if (id.includes('@react-three') || /[\\/]three[\\/]/.test(id)) return undefined
              if (/[\\/]react(-dom)?[\\/]/.test(id)) return 'react-vendor'
              return undefined
            },
          },
    },
  },
}))
