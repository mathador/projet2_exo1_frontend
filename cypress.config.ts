import { defineConfig } from "cypress";

// const codeCoverage = require("@cypress/code-coverage/task");
// const webpackPreprocessor = require("@cypress/webpack-preprocessor");
import coverageTask from '@cypress/code-coverage/task';

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
    // visitedUrls: {
    //   collect: true,
    //   urlsFilename: 'cypress_visited_urls.json'
    // },
    // coverage: {
    //   instrument: '**/pages/**/*.{js,ts,jsx,tsx}',
    //   //exclude: ['**/cypress/**/*.*']
    // }
  },
  e2e: {
    //experimentalRunAllSpecs: true,
    // env: {
    //   baseUrl: "http://localhost:4200",
    //   apiUrl: "http://localhost:8080/api",
    //   //authToken: "your-auth-token-here"
    //   login_url: "/login",
    //   register_url: "/register",
    //   student_url: "/student",
    //   students_url: "/students",
    //   logout_api: "/logout",
    //   visitedUrls: {
    //     collect: true,
    //     urlsFilename: 'cypress_visited_urls.json'
    //   },
    //   coverage: {
    //     instrument: 'src/**/*',
    //     exclude: ['cypress/**/*.*']
    //   }
    // },
    setupNodeEvents(on, config) {
      // https://github.com/bahmutov/cypress-code-coverage
      //require('@bahmutov/cypress-code-coverage/plugin')(on, config)
      require('@cypress/code-coverage/task')(on, config)  
      return config; // It's important to return the config object
    },
  },
});
