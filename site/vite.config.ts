import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./scripts/vite/sites-vite-plugin";
export default defineConfig({
  plugins: [vinext(), sites({ mockAuth: false })],
  server: { host: "127.0.0.1" },
  build: { sourcemap: false },
});
