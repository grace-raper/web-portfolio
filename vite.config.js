import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.')[1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      external: ['caspir-cam']
    },
  },
  resolve: {
    packageDirs: [resolve(__dirname, 'node_modules')]
  },
  server: {
    fs: {
      allow: ['.']
    },
    watch: {
      ignored: ['**/caspir-cam/**', '**/caspir-cam', '**/node_modules/**']
    }
  },
  optimizeDeps: {
    exclude: ['caspir-cam']
  }
})
