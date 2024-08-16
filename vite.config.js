import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.112.118:5050',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})