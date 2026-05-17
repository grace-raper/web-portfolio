import { defineConfig } from 'vite'
import { resolve } from 'path'

// Mirror Firebase hosting rewrites so dev server behaves the same as production
const firebaseDevRewrites = {
  name: 'firebase-dev-rewrites',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const url = req.url?.split('?')[0];
      const rewrites = {
        '/cv':         '/cv.html',
        '/resume':     '/cv.html',
        '/digital-cv': '/cv.html',
        '/caspir-cam': '/caspir-cam/index.html',
        '/shoebox-engine': '/shoebox-engine/index.html',
      };
      if (rewrites[url]) req.url = rewrites[url];
      next();
    });
  }
};

export default defineConfig({
  plugins: [firebaseDevRewrites],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cv: resolve(__dirname, 'cv.html')
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
