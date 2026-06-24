import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const workspaceRoot = path.resolve(__dirname, "../..");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(workspaceRoot, "src"),
      "@workspace/api-client-react": path.resolve(workspaceRoot, "lib/api-client-react/src"),
    },
    moduleDirectories: [
      "node_modules",
      path.resolve(__dirname, "node_modules"),
      path.resolve(workspaceRoot, "node_modules"),
    ],
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
    fs: {
      allow: [workspaceRoot],
    },
  },
});
