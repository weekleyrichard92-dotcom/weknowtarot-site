import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        products: path.resolve(__dirname, 'products.html'),
        collections: path.resolve(__dirname, 'collections.html'),
        app: path.resolve(__dirname, 'app.html'),
        digitalProducts: path.resolve(__dirname, 'digital-products.html'),
        blog: path.resolve(__dirname, 'blog.html'),
        checkout: path.resolve(__dirname, 'checkout.html'),
        tarotGame: path.resolve(__dirname, 'tarot-game.html')
      }
    }
  }
})
