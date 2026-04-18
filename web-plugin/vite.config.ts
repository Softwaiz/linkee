import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/entrypoints/globals.css";`,
            },
        },
    },
})