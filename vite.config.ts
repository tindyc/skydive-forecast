import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/skydive-forecast/",   // 👈 MUST match repo name on GitHub
});
