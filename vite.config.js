import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import analyze from 'rollup-plugin-analyzer'
// import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ vue() ],
  server: {
    port: 8080,
    proxy: {
      '/.netlify': {
        target: 'https://departure-neuaubing-stage.netlify.app',
        changeOrigin: true
      },
      '/captions': {
        target: 'https://captions.cloud.vimeo.com',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      // plugins: [analyze(), visualizer()]
    }
  }
})
