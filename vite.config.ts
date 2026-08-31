import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.MOSTRUARIO_PROXY_TARGET || 'http://127.0.0.1:8000'

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      entries: ['index.html'],
    },
    server: {
      host: true,
      port: 5173,
      watch: {
        ignored: ['**/private/**', '**/Logo praiana coral e rosa*_files/**'],
      },
      proxy: {
        '/api': { target: backendTarget, changeOrigin: true },
        '/uploads': { target: backendTarget, changeOrigin: true },
        '/rails': { target: backendTarget, changeOrigin: true },
      },
    },
  }
})
