import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueI18nPlugin({compositionOnly: false})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/client', import.meta.url)),
      '$': fileURLToPath(new URL('./src/server', import.meta.url)),
      '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
    }
  },
  build: {
    manifest: true,
    emptyOutDir: false,
    rollupOptions: {
      input: './src/client/main.ts',
    },
  },
  clearScreen: false,
})
