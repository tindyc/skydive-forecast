import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-404",
      closeBundle() {
        const indexPath = resolve(__dirname, "dist/index.html");
        const notFoundPath = resolve(__dirname, "dist/404.html");
        if (existsSync(indexPath)) {
          copyFileSync(indexPath, notFoundPath);
          console.log("✅ Copied index.html → 404.html");
        }
      },
    },
  ],
  base: "/skydive-forecast/", 
  build: {
    outDir: "dist",
  },
});
