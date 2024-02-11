import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Open Bookmarks",
  version: "1.0.0",
  permissions: ["storage", "activeTab", "tabs", "notifications", "background"],
  background: {
    service_worker: "src/background/index.ts",
  },
  icons: {
    48: "icon.jpg",
  },
  commands: {
    hyper_reload: {
      suggested_key: {
        default: "Ctrl+Shift+0",
        mac: "Command+Shift+0",
      },
      description: "Hyper reload",
    },
  },
  action: {
    default_popup: "index.html",
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
