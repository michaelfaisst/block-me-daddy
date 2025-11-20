import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
    manifest_version: 3,
    name: "Block me daddy",
    version: "1.0.0",
    description:
        "Stay focused and productive by blocking distracting websites with customizable schedules. Your productivity guardian with a sense of humor.",
    action: { default_title: "Block me daddy" },
    options_page: "options.html",
    permissions: ["storage", "tabs"],
    host_permissions: ["<all_urls>"],
    background: {
        service_worker: "src/background.ts",
        type: "module"
    },
    icons: {
        "16": "assets/icon16.png",
        "32": "assets/icon32.png",
        "48": "assets/icon48.png",
        "128": "assets/icon128.png"
    }
});
