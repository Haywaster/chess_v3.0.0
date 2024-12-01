import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      app: '/src/app',
      shared: '/src/shared',
      widgets: '/src/widgets',
      entities: '/src/entities',
      features: '/src/features',
      pages: '/src/pages'
    }
  },
  server: {
    port: 3000
  }
})
