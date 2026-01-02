// This config FAILS - uses @cloudflare/vite-plugin with bundled xlsx
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
  ssr: {
    // Force xlsx-js-style to be bundled instead of kept external
    noExternal: ["xlsx-js-style"],
  },
});
