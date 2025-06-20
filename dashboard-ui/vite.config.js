import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api/users': 'http://localhost:8081',
            '/api/flats': 'http://localhost:8082',
            '/api/heating': 'http://localhost:8083',
            '/api/statistics': 'http://localhost:8084',
        },
    },
    build: {
        outDir: 'dist',
    },
});
