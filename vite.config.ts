import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/population-graph-app/" : "/",
  server: {
    host: true,
    port: 5173,
  },
});
