import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    base: '/Ascension-Tycoon/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
    },
    server: {
        port: 3000,
        open: true,
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
            manifest: {
                name: 'Ascension: Trance Tycoon 2026',
                short_name: 'Ascension',
                description: 'Manage your Label, Produce Hits, Rule the Underground.',
                theme_color: '#000000',
                background_color: '#000000',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '.',
                icons: [
                    {
                        src: 'assets/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'assets/icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            }
        })
    ]
});
