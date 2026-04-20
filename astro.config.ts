import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import { config } from "./src/config";
import { assertSiteConfigPublicAssets } from "./src/utils/validate-site-config";

import cloudflare from "@astrojs/cloudflare";

assertSiteConfigPublicAssets(config);

export default defineConfig({
  site: "https://cursorsaudi.com",
  integrations: [sitemap()],

  vite: {
    plugins: [tailwind()],
  },

  adapter: cloudflare()
});