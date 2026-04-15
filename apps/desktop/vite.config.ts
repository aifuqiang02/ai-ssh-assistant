import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import VueInspector from 'vite-plugin-vue-inspector-ai'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VueInspector({
      enabled: false,
      toggleButtonVisibility: 'always'
    }),
    monacoEditorPlugin({
      languageWorkers: ['editorWorkerService', 'json', 'typescript']
    }),
    electron([
      {
        // Main process entry file
        entry: 'electron/main/index.ts',
        onstart({ startup }) {
          startup()
        },
        vite: {
          build: {
            sourcemap: true,
            minify: process.env.NODE_ENV === 'production',
            outDir: 'dist-electron/main',
            rollupOptions: {
              external: [
                'electron',
                'sqlite3',
                'better-sqlite3',
                'ssh2',
                '@ai-ssh/database', // 不打包 database 包
                '@prisma/client', // 不打包 Prisma Client
                '.prisma/client' // 不打包生成的客户端
              ]
            }
          }
        }
      },
      {
        // Preload scripts
        entry: 'electron/preload/index.ts',
        onstart({ reload }) {
          reload()
        },
        vite: {
          build: {
            sourcemap: 'inline',
            minify: process.env.NODE_ENV === 'production',
            outDir: 'dist-electron/preload',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ai-ssh/shared': resolve(__dirname, '../../packages/shared/src')
    }
  },
  css: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  },
  build: {
    sourcemap: true,
    outDir: 'dist'
  },
  server: {
    port: 5173,
    host: true
  }
})
