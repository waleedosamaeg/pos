import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
   resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@css': path.resolve(__dirname, 'src/assets/static/css'),
        "@comp" : path.resolve(__dirname , "src/assets/components"),
        "@font" : path.resolve(__dirname , "src/assets/static/fonts"),
        "@lang" : path.resolve(__dirname , "src/assets/langs"),
        "@context" : path.resolve(__dirname , "src/context"),
        "@config" : path.resolve(__dirname , "src/config"),
        "@page" : path.resolve(__dirname , "src/pages/"),
        "@logo" : path.resolve(__dirname , "src/assets/static/imgs/logo"),
        "@util" : path.resolve(__dirname, 'src/utils/'),
        "@hook" : path.resolve(__dirname, 'src/hooks'),

      }
  }
})
