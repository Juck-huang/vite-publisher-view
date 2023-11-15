import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }] // 加此别名选项
  },
  server: {
    open: '/', // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://172.168.20.160:8002/aps-web/',
        // target: 'https://www.hkqsgl.com/aps-web/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
