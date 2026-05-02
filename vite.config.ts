import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
   base: '/bookvica/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'docs',
    sourcemap: false,
  },
}))