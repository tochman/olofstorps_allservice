import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './',
  base: '/',  // Changed from './' to '/' for proper absolute paths
  publicDir: 'public',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          vendor: ['animejs'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  preview: {
    port: 4173,
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@styles': resolve(__dirname, './src/styles'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './public/assets'),
    },
  },

  css: {
    devSourcemap: true,
  },

  optimizeDeps: {
    include: ['animejs'],
  },
});
