import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static front end. The /api folder is handled by Vercel serverless functions,
// so it stays out of the Vite build. Standard React/Node ~ portable by design.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
