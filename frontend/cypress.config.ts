import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.BACKEND_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
  },
});
