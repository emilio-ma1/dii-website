import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',  // Archivo opcional para configuraciones globales
    include: ['src/**/*.{test,spec}.{js,jsx}', 'src/tests/**/*.{test,spec}.{js,jsx}']
  },
})