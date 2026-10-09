module.exports = {
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // Implementar listeners si fuera necesario
    },
  },
};
