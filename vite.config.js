import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages project site: https://mugalkhodjidaga-sys.github.io/student-tracker/
const base = '/student-tracker/';

export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Shivayogi Jnana Mandir Health',
        short_name: 'Health Tracker',
        description: 'Offline health records for residential school',
        theme_color: '#059669',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: `${base}`,
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
      },
    }),
  ],
});
