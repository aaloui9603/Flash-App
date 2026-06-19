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

      // PWA auch lokal testen
      devOptions: {
        enabled: true
      },

      manifest: {
        name: 'Flashback — Deine Lernkartei',
        short_name: 'Flashback',
        description: 'Deine persönliche Lernkartei-App mit Flashcards, Notizen und KI-Unterstützung',
        theme_color: '#00BFFF',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,webp}'],

        // API-Anfragen niemals cachen — immer live vom Server
        navigateFallbackDenylist: [/^\/api/]
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