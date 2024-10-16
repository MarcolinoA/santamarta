import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://santamarta-frontend.onrender.com", // Moved baseUrl here
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    chromeWebSecurity: false,
  },
});
