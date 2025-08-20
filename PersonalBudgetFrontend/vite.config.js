import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    server: {
        port: 59506,
        proxy: {
            '/api': {
                target: 'https://localhost:7163', // ← usa la porta HTTPS del tuo backend ASP.NET
                changeOrigin: true,
                secure: false
            }
        }
    }
})