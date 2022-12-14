import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression'
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'
import importToCDN from 'vite-plugin-cdn-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue(),
		vuetify({ autoImport: true }),
        visualizer({
          emitFile: true,
          filename: 'stats.html',
          open: true
        }),
        viteCompression({
            algorithm: 'gzip',
            threshold: 10240,
            ext: ".gz",
            deleteOriginFile: false
        }),
        importToCDN({
          modules: [
              {
                  name: 'axios',
                  var: 'axios',
                  path: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.1/axios.min.js'
              },
              {
                  name: 'vue',
                  var: 'Vue',
                  path: 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.global.prod.min.js'
              },
              {
                  name: 'vue-demi', // resolve vue var
                  var: 'VueDemi',
                  path: 'lib/index.iife.min.js'
              },
              {
                  name: 'vue-router',
                  var: 'VueRouter',
                  path: 'https://cdnjs.cloudflare.com/ajax/libs/vue-router/4.1.6/vue-router.global.prod.min.js'
              },
              {
                  name: 'vditor',
                  var: 'Vditor',
                  path: 'https://cdnjs.cloudflare.com/ajax/libs/vditor/3.8.18/index.min.js',
                  css: 'https://cdnjs.cloudflare.com/ajax/libs/vditor/3.8.18/index.min.css'
              },
              {
                  name:"vuetify",
                  var:"Vuetify",
                  path:"https://cdn.jsdelivr.net/npm/vuetify@3.0.6/dist/vuetify.min.js",
                  css:"https://cdn.jsdelivr.net/npm/vuetify@3.0.6/dist/vuetify.min.css"
              },
          ]
        })
	],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // 'vue': 'https://unpkg.com/vue@3/dist/vue.esm-browser.js',
    }
  }
})
