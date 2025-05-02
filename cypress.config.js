// cypress.config.js
import { defineConfig } from 'cypress'
// import the named export, not a default
import { downloadFile } from 'cypress-downloadfile/lib/addPlugin.js'

export default defineConfig({
  projectId: '7mfas3',
  e2e: {
    setupNodeEvents(on, config) {
      // register the downloadFile task explicitly
      on('task', { downloadFile })
      return config
    },
    baseUrl: 'http://192.168.1.68:8080',
  },
})
