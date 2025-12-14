import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.dirname(process.cwd())
  const envAppFile = loadEnv(mode, envDir)

  return {
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
      port: parseInt(envAppFile.VITE_CLIENT_PORT),
      proxy: {
        '/api': envAppFile.VITE_SERVER_URL || 'http://localhost:5000',
        '/ws': envAppFile.VITE_WS_SERVER_URL || 'ws://localhost:5000'
      }
    },
    envDir
  }
})
