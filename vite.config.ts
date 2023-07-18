/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    cssTarget: 'chrome61',
    sourcemap: true,
    rollupOptions: {
      external: ['klinecharts'],
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'style.css') {
            return 'klinecharts-ui.css'
          }
        },
        globals: {
          klinecharts: 'klinecharts'
        },
      },
    },
    lib: {
      entry: './src/index.ts',
      name: 'klinechartsui',
      fileName: (format) => {
        if (format === 'es') {
          return 'klinecharts-ui.js'
        }
        if (format === 'umd') {
          return 'klinecharts-ui.umd.js'
        }
      }
    }
  }
})
