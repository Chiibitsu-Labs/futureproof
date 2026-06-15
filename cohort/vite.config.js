import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static build output goes to /dist. Vercel serves /dist and runs /api as
// serverless functions automatically ~ no extra config needed.
export default defineConfig({
  plugins: [react()],
})
