import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';

export default defineConfig({
  root: './',
  base: '/',
  publicDir: false,  // Disable default public dir since our assets are in root
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: [
        '/js/libs.min.js',
        '/js/gallery-init.js',
      ]
    },
  },

  plugins: [
    {
      name: 'copy-assets',
      closeBundle() {
        console.log('📦 Copying static assets...');
        
        // Copy entire img folder
        const imgSrc = resolve(__dirname, 'img');
        const imgDest = resolve(__dirname, 'dist/img');
        if (existsSync(imgSrc)) {
          cpSync(imgSrc, imgDest, { recursive: true });
          console.log('✅ Images copied');
        }
        
        // Copy entire css folder (for any standalone CSS files)
        const cssSrc = resolve(__dirname, 'css');
        const cssDest = resolve(__dirname, 'dist/css');
        if (existsSync(cssSrc)) {
          cpSync(cssSrc, cssDest, { recursive: true });
          console.log('✅ CSS files copied');
        }
        
        // Copy entire fonts folder
        const fontsSrc = resolve(__dirname, 'fonts');
        const fontsDest = resolve(__dirname, 'dist/fonts');
        if (existsSync(fontsSrc)) {
          cpSync(fontsSrc, fontsDest, { recursive: true });
          console.log('✅ Fonts copied');
        }
        
        // Copy templates
        const templatesSrc = resolve(__dirname, 'src/templates');
        const templatesDest = resolve(__dirname, 'dist/src/templates');
        if (!existsSync(templatesDest)) {
          mkdirSync(templatesDest, { recursive: true });
        }
        const templates = ['project1.hbs', 'project2.hbs', 'project3.hbs', 'project4.hbs', 'project5.hbs', 'contact-form.hbs'];
        templates.forEach(file => {
          copyFileSync(
            resolve(templatesSrc, file),
            resolve(templatesDest, file)
          );
        });
        console.log('✅ Templates copied');
        
        // Copy legacy JS files
        const jsDest = resolve(__dirname, 'dist/js');
        if (!existsSync(jsDest)) {
          mkdirSync(jsDest, { recursive: true });
        }
        copyFileSync(
          resolve(__dirname, 'js/libs.min.js'),
          resolve(jsDest, 'libs.min.js')
        );
        copyFileSync(
          resolve(__dirname, 'js/gallery-init.js'),
          resolve(jsDest, 'gallery-init.js')
        );
        console.log('✅ Legacy JS files copied');
        
        console.log('✅ All static assets copied successfully!');
      }
    }
  ],

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
