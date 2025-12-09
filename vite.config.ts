import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Configuração para garantir que arquivos da raiz sejam incluídos se não estiverem na pasta public
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  // Instruir o Vite a tratar a raiz como diretório público estático também, 
  // para copiar manifest e sw se eles não estiverem sendo processados
  publicDir: 'public' 
});