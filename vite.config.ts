import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

import manifest from "./manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src")
        }
    },
    plugins: [react(), crx({ manifest })],
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173
        }
    },
    build: {
        rollupOptions: {
            input: {
                blocked: "blocked.html"
            }
        }
    }
});
