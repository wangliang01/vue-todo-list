import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { mockApiPlugin } from './src/plugins/mockApiPlugin'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    mockApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
