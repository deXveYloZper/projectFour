import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // add plugin if you're using react

export default defineConfig({
  plugins: [react()], // add plugin if you're using react
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        secure: false, // Set to true if your backend uses HTTPS
      },
    },
  },
});