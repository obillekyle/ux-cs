import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dependencies } from "./package.json";

function renderChunks(deps: Record<string, string>) {
  let chunks = {};
  Object.keys(deps).forEach((key) => {
    if (["react", "react-router-dom", "react-dom"].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:1000/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      },
      "/assets": {
        target: "http://localhost:1000/assets",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/assets/, "")
      },
      "/admin/api": {
        target: "http://localhost:1000/admin/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin\/api/, "")
      },
    }
  },
  build: {
    target: "esnext",
    sourcemap: false,
    outDir: "public",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        assetFileNames: "react/[name].[ext]",
        entryFileNames: "react/[name].js",
        chunkFileNames: "react/[name].js",
        manualChunks: {
          vendor: ["react", "react-router-dom", "react-dom"],
          ...renderChunks(dependencies),
        },
      },
    },
  },
})
