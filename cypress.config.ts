import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "czjm25",

  env: {
    baseUrl: "http://localhost:4200",
    apiUrl: "http://localhost:8080/api",
    //authToken: "your-auth-token-here"
    login_url: "/login",
    register_url: "/register",
    student_url: "/student",
    students_url: "/students",
    logout_api: "/logout",
  },
  e2e: {
    env: {
      baseUrl: "http://localhost:4200",
      apiUrl: "http://localhost:8080/api",
      //authToken: "your-auth-token-here"
      login_url: "/login",
      register_url: "/register",
      student_url: "/student",
      students_url: "/students",
      logout_api: "/logout",
      coverage: {
        instrument: 'instrumented/app/pages/**/*.ts',
        exclude: ['src/app/**/*.spec.ts', 'cypress/**/*.*']
      }
    },
    setupNodeEvents(on, config) {
      // https://github.com/cypress-io/code-coverage
      require('@cypress/code-coverage/task')(on, config)
      return config; // It's important to return the config object
    },
  },
});
