import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "AttractorReact",
      fileName: "attractor-react",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "three",
        "three-stdlib",
        "lucide-react",
      ],
      output: {
        exports: "named",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
