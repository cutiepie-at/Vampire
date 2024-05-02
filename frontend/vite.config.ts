import {fileURLToPath, URL} from 'node:url';
import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueI18nPlugin({compositionOnly: false})],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': fileURLToPath(new URL('./node_modules/bootstrap', import.meta.url)),
    },
  },
  build: {
    manifest: true,
    emptyOutDir: false,
    rollupOptions: {
      input: ['./src/main.ts', './index.html'],
    },
  },
  clearScreen: false,
  server: {
    proxy: {//for dev
      '^/api/.*$': {
        target: 'http://localhost:5172',
        changeOrigin: true,
      },
    },
  },
});
