import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy n8n REST API calls — injects API key server-side (never exposed in browser)
        '/n8n-api': {
          target: env.N8N_BASE_URL || 'https://sai.workflowshub.cloud',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/n8n-api/, '/api/v1'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.N8N_API_KEY) {
                proxyReq.setHeader('X-N8N-API-KEY', env.N8N_API_KEY)
              }
            })
          },
        },
        // Proxy webhook calls for lead submission
        '/n8n-webhook': {
          target: env.N8N_BASE_URL || 'https://sai.workflowshub.cloud',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/n8n-webhook/, '/webhook'),
        },
      },
    },
  }
})
