import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@log": path.resolve(__dirname, "./src/lib/log"),
    },
  },
});
