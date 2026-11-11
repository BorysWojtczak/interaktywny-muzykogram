import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Root base for Cursor publish-app (and any root host).
export default defineConfig({
  plugins: [react()],
  base: '/',
})
