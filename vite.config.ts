import { fileURLToPath, URL } from "node:url";
import { join } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxy = { "/functions/v1/app": "http://127.0.0.1:8000" };

// The bundled UI catalog, utils and mobile hook live at the project root; site code lives in src/.
const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@/components/ui", replacement: join(root, "components/ui") },
      { find: "@/lib/utils", replacement: join(root, "lib/utils") },
      { find: "@/hooks/use-mobile", replacement: join(root, "hooks/use-mobile") },
      { find: "@", replacement: join(root, "src") },
    ],
  },
  server: { host: "127.0.0.1", proxy },
  preview: { host: "127.0.0.1", proxy },
  build: { outDir: "dist" },
});
