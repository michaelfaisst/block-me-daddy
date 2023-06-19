import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "src")
        }
    },
    plugins: [react(), crx({ manifest })],
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173
        }
    }
});
