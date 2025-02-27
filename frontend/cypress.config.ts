import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
  },
});
