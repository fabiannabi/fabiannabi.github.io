import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const here = fileURLToPath(new URL(".", import.meta.url));

/**
 * Two entry points, not a client-side router.
 *
 * GitHub Pages serves static files. An SPA router would need the 404.html
 * rewrite hack to survive a refresh on /profile/, and would ship the router and
 * both pages' JS to a visitor who only ever reads the cover. Two HTML entries
 * give real URLs, no hack, and a cover bundle that carries nothing the cover
 * does not use.
 */
export default defineConfig({
  // User site (fabiannabi.github.io) is served from the domain root.
  base: "/",
  plugins: [react()],
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        cover: resolve(here, "index.html"),
        profile: resolve(here, "profile/index.html"),
      },
    },
  },
  css: {
    modules: {
      // Readable in devtools, hashed enough to stay collision-free.
      generateScopedName: "[name]__[local]__[hash:base64:5]",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/**/main.tsx"],
    },
  },
});
