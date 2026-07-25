import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../../../");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "strange-attractorz": resolve(ROOT, "src/index.tsx"),
      "strange-background": resolve(__dirname, "../src/index.tsx"),
      "@": resolve(ROOT, "src"),
    },
  },
});
