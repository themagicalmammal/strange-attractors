import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "StrangeBackground",
      formats: ["es", "cjs"],
      fileName: (format) => `strange-background.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "strange-attractorz", "three", "three-stdlib", "lucide-react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "strange-attractorz": "StrangeAttractorz",
          three: "THREE",
          "three-stdlib": "THREE_STDLIB",
          lucideReact: "LucideReact",
        },
      },
    },
  },
});
