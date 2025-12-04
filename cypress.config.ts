import { defineConfig } from "cypress";
import codeCoverageTask from "@cypress/code-coverage/task";

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
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config; // It's important to return the config object
    },
  },
});
