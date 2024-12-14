const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080', // Cambia esto a la URL de tu API o aplicación
    setupNodeEvents(on, config) {
      // Implementa aquí los listeners de eventos si los necesitas
    },
  },
});
