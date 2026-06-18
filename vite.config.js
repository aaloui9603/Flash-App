import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Flashcard-App',
        short_name: 'Flashcard',
        description: 'Deine persönliche Lernkartei-App',
        theme_color: '#00BFFF',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: '/icons.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webp}']
      }
    })
  ],

  // Proxy: leitet /api-Anfragen an lokalen Express-Server weiter
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})