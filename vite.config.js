import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import Components from 'unplugin-vue-components/vite'
// import analyze from 'rollup-plugin-analyzer'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
    // Components()
  ],
  server: {
    port: 8080,
    // proxy: {}
  },
  build: {
    rollupOptions: {
      // plugins: [analyze(), visualizer()]
    }
  }
})
