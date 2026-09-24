import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/qbits-pretest-v2/', 
  build: {
    rollupOptions: {
      external: ['fsevents'],
    },
  },
})