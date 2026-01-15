import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Reduce el tamaño de advertencias de chunks
    chunkSizeWarningLimit: 1000,
    // Optimiza el proceso de build
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        // Separa dependencias en chunks manuales
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  // Optimiza las dependencias
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  // Previene errores de memoria
  server: {
    hmr: {
      overlay: false,
    },
  },
})