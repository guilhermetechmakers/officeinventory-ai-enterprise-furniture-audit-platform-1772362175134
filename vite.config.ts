import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = env.VITE_SUPABASE_URL ?? ''

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: supabaseUrl
        ? {
            '/api': {
              target: supabaseUrl,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, '/functions/v1'),
            },
          }
        : undefined,
    },
  }
})
