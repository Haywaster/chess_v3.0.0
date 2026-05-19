import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
// import type { UserConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.dirname(process.cwd())
  const envAppFile = loadEnv(mode, envDir)

  return {
    plugins: [
      react(),
      svgr(),
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap'
      })
    ],
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/react')
            ) {
              return 'react'
            }

            if (id.includes('node_modules/react-router')) {
              return 'router'
            }

            if (id.includes('node_modules/styled-components')) {
              return 'styled'
            }
          }
        }
      }
    },
    envDir
  }
})
