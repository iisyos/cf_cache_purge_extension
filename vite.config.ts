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
    16: "icon16.png",
    32: "icon32.png",
    48: "icon48.png",
    128: "icon128.png",
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
