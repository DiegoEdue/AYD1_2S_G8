const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true, // HU-048: evidencia en video de la ejecución exitosa
  screenshotOnRunFailure: true,
  retries: { runMode: 1, openMode: 0 },
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 15000,
  },
});
