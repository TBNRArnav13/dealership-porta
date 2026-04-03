import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
      '/dealer': 'http://localhost:8000',
      '/add_review': 'http://localhost:8000',
    }
  }
})
