import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => {
  // load optional replit plugins dynamically to avoid require() of ESM when Vite runs in CJS
  const extraPlugins = (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined)
    ? [
        (await import("@replit/vite-plugin-cartographer")).cartographer(),
        (await import("@replit/vite-plugin-dev-banner")).devBanner()
      ]
    : [];

  // load runtime error overlay plugin dynamically (handles ESM/CommonJS differences)
  let runtimeErrorOverlayPlugin = null;
  try {
    const mod = await import("@replit/vite-plugin-runtime-error-modal");
    // some packages export the plugin as default, some as named export
    const plugin = mod.default ?? mod;
    runtimeErrorOverlayPlugin = typeof plugin === "function" ? plugin() : plugin;
  } catch {
    // plugin not available — continue without it
    runtimeErrorOverlayPlugin = null;
  }

  return {
    plugins: [
      react(),
      ...(runtimeErrorOverlayPlugin ? [runtimeErrorOverlayPlugin] : []),
      ...extraPlugins
    ],
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "client", "src"),
        "@shared": path.resolve(process.cwd(), "shared"),
        "@assets": path.resolve(process.cwd(), "attached_assets")
      }
    },
    root: path.resolve(process.cwd(), "client"),
    build: {
      outDir: path.resolve(process.cwd(), "dist/public"),
      emptyOutDir: true
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"]
      }
    }
  };
});
