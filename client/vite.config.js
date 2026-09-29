import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./src/test/setup.js",
  passWithNoTests: false,

  coverage: {
    provider: "v8",
    reporter: ["text", "html", "lcov"],
    reportsDirectory: "./coverage",
  },
  },
});
