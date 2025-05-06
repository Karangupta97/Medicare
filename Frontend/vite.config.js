import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',  // Ensures Vite looks in the correct folder
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        // target: "http://localhost:4000", 
        target: "https://api.medicares.in",
        // target: "https://medicare-backend-pdci8.ondigitalocean.app", 
        // target: "https://medicare-3c0t.onrender.com", 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        ws: true, // Enable WebSocket proxying
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
            console.error('Error details:', {
              message: err.message,
              code: err.code,
              stack: err.stack
            });
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', {
              method: req.method,
              url: req.url,
              path: req.path,
              headers: proxyReq.getHeaders()
            });
            
            // Ensure Authorization header is properly forwarded
            if (req.headers.authorization) {
              proxyReq.setHeader('Authorization', req.headers.authorization);
            }
            
            // For multipart/form-data requests, ensure the content-type header is preserved
            if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
              console.log('Handling multipart/form-data request');
              // Don't modify the content-type header for multipart/form-data
            }
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', {
              statusCode: proxyRes.statusCode,
              url: req.url,
              headers: proxyRes.headers
            });
            
            // Log 404 errors with more details
            if (proxyRes.statusCode === 404) {
              console.error('404 Error Details:', {
                method: req.method,
                url: req.url,
                path: req.path,
                headers: req.headers,
                body: req.body
              });
            }
          });
        },
      }
    },
  },
})
