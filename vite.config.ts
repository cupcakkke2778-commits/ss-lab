import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// 仅在构建时启用 Electron
const isElectronBuild = process.env.ELECTRON_BUILD === 'true'

export default defineConfig({
  plugins: [
    vue(),
    ...(isElectronBuild ? electron([
      {
        entry: 'electron/main.ts',
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron']
            }
          }
        }
      }
    ]) : []),
    ...(isElectronBuild ? [renderer()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'S&S Lab - 信号与系统教学学习平台',
        short_name: 'S&S Lab',
        description: '信号与系统交互式教学学习桌面应用',
        theme_color: '#1a1a2e',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'any',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'external-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
