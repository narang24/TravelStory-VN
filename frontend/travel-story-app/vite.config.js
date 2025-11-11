import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    fontFamily: {
      display: ["Poppins","sans-serif"],
    },

    extend: {
      //Colors used in the project
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage: {
        'login-bg-img':"url('./src/assets/images/bg-image.png')",
        'signup-bg-img':"url('./src/assets/images/signup-image.png')"
      },
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
