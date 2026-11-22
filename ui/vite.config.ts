import { resolve } from "node:path"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "./src") },
  },
  build: {
    outDir: "../assets/shadcn",
    emptyOutDir: true,
    manifest: true,
    rolldownOptions: { input: resolve(import.meta.dirname, "src/main.tsx") },
  },
})
