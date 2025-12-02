import { defineConfig } from "cypress";

// const codeCoverage = require("@cypress/code-coverage/task");
// const webpackPreprocessor = require("@cypress/webpack-preprocessor");

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
      require('@cypress/code-coverage/task')(on, config); // Add this line
      return config; // It's important to return the config object
      // codeCoverage(on, config);
      // return config;
      // codeCoverage(on, config);
      // on(
      //   'file:preprocessor',
      //   webpackPreprocessor({
      //     webpackOptions: {
      //       module: {
      //         rules: [
      //           {
      //             test: /\.js$/,
      //             exclude: /node_modules/,
      //             use: {
      //               loader: 'babel-loader'
      //             }
      //           }
      //         ]
      //       }
      //     }
      //   })
      // );
      // return config;
    },
  },

  // component: {
  //   devServer: {
  //     framework: "angular",
  //     bundler: "webpack",
  //   },
  //   //specPattern: "**/*.cy.ts",
  // },
});
