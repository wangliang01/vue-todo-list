import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { mockApiPlugin } from './src/plugins/mockApiPlugin'

console.log('当前环境变量：', {
  NODE_ENV: process.env.NODE_ENV, // 'development' 或 'production'
})

const isDev = process.env.NODE_ENV === 'development'

export default defineConfig({
  base: '/vue-todo-list/',
  plugins: [vue(), vueDevTools(), isDev ? mockApiPlugin() : null].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
