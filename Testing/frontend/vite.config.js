import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    include: [
      'tests/unit/**/*.{test,spec}.{js,jsx}',
      'tests/component/**/*.{test,spec}.{js,jsx}'
    ]
  }
})