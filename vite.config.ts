import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project Pages: https://boryswojtczak.github.io/interaktywny-muzykogram/
export default defineConfig({
  plugins: [react()],
  base: '/interaktywny-muzykogram/',
})
