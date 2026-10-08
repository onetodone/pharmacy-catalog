import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  const apiProxyTarget = env.VITE_DEV_API_PROXY || 'http://localhost:3000'
  const devPort = Number(env.VITE_DEV_PORT) || 3001

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(import.meta.dirname, './src') },
    },
    server: {
      port: devPort,
      proxy: {
        '/api': { target: apiProxyTarget, changeOrigin: true },
        '/uploads': { target: apiProxyTarget, changeOrigin: true },
      },
      host: true,
    },
  }
})
