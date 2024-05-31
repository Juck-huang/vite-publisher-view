import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: resolve(__dirname, 'src') }] // 加此别名选项
  },
  base: './',
  server: {
    open: '/', // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://172.168.10.164:8002/aps-web',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
})
