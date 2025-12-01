import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    baseUrl: "http://localhost:4200",
    apiUrl: "http://localhost:8080/api",
    //authToken: "your-auth-token-here"
    login_url: '/login',
    register_url: '/register',
    logout_api: '/logout'
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
