# Première utilisation:

lancez la commande (qui téléchargera les packages nécessaires)
```bash
npm install
```

Puis pour lancer le projet:
```bash
npm run start
```
Tip memotechnique:
    "run start" R est avant S

Vous devriez pouvoir tester le fonctionnement avec cette première url:
[http://localhost:4200/login]()

# Pour les tests unitaires

Voici quelques commandes de Jest à connaître :

 ```bash
 node_modules/.bin/jest --coverage   
 ```
 – vous permet d’afficher la documentation de Jest et les options possibles.

```bash
 node_modules/.bin/jest --watch  
```
 – vous permet de “watcher” vos fichiers.
 Use --no-watch (or --watch=false) to explicitly disable the watch mode.


 pour le rapport de cuoverture:

```bash
 npm test
```
 un dossier "/coverage" sera créé avec un site statique.


# pour les tests integrations et fonctionnels

installer cypress

```bash
npm install cypress --save-dev
```
lancer cypress

```bash
npx cypress open
```

installer faker

```bash
npm install @faker-js/faker --save-dev
```

exemple de code

```javascript
import { faker } from '@faker-js/faker'; //Vous avez besoin d’importer la librairie
const randomName = faker.person.fullName(); //créer un nom+prénom
```

# couverture de code avec cypress


Pour instrumenter le code
```bash
npx nyc instrument --compact=false src instrumented
```

To generate an HTML code coverage report for your Cypress tests, you'll primarily use the official `@cypress/code-coverage` plugin to collect data and the `nyc` (Istanbul) tool to create the final HTML report.

The setup involves three main phases: installing and configuring the plugin, instrumenting your application code, and generating the report.

### 📋 Setting Up Code Coverage
The process follows these main steps:
```mermaid
flowchart LR
    subgraph S1 [Setup Plugin]
        A1[Install Plugin] --> A2[Add to Config File]
        A1 --> A3[Add to Support File]
    end

    subgraph S2 [Instrument Code]
        B1[Choose Method] --> B2[“Via Babel<br>(common for build tools)”]
        B1 --> B3[“Via NYC CLI<br>(manual instrument)”]
    end

    S1 --> S3[Run Tests]
    S2 --> S3

    S3 --> S4[Generate HTML Report]

    style S1 fill:#e1f5fe
    style S2 fill:#f3e5f5
    style S3 fill:#fff
    style S4 fill:#e8f5e8
```

**1. Install the Plugin**
First, install the necessary packages as development dependencies:
```bash
npm install --save-dev @cypress/code-coverage nyc
# If using Babel for instrumentation, you might also need:
npm install --save-dev babel-plugin-istanbul
```

**2. Configure Cypress**
Update your `cypress.config.js` file to load the plugin task within the `setupNodeEvents` function:
```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config); // Add this line
      return config; // It's important to return the config object
    },
  },
});
```
Also, import the plugin's support in your `cypress/support/e2e.js` file:
```javascript
// cypress/support/e2e.js
import '@cypress/code-coverage/support';
```

**3. Instrument Your Application Code**
**This is the most critical step.** The plugin collects data from a `window.__coverage__` object, which must be present in your application. You need to **instrument** your code to create this object. The method depends on your build setup:
*   **Using Babel (common for React, Vue, etc.)**: If your project already uses Babel, add `babel-plugin-istanbul` to your configuration (e.g., `.babelrc`). This instruments the code during transpilation.
    ```json
    {
      "plugins": ["istanbul"]
    }
    ```
*   **Using NYC CLI**: You can manually instrument your source code and serve the instrumented version during testing:
    ```bash
    npx nyc instrument src instrumented
    # Then, serve files from the 'instrumented' folder instead of 'src'
    ```

### 📊 Generating the HTML Report
After completing the setup:
1.  **Run Your Tests**: Start your instrumented application and execute your tests using `npx cypress run`.
2.  **Generate the Report**: After the tests finish, the coverage data is saved. Generate the HTML report with this command:
    ```bash
    npx nyc report --reporter=html
    ```
3.  **View the Report**: Open the generated file `coverage/index.html` in your browser to explore the interactive report, which shows coverage for statements, branches, functions, and lines.

### 🚨 Troubleshooting Common Issues
*   **No Coverage Data / `window.__coverage__` is undefined**: This almost always means your application code is not instrumented. Double-check your Babel or build tool configuration.
*   **Report Includes Cypress Spec Files**: By default, the report might include your test files. To exclude them, add an `nyc` configuration object to your `package.json`:
    ```json
    {
      "nyc": {
        "include": ["src/**/*.js"],
        "exclude": ["cypress/**/*.js"]
      }
    }
    ```
*   **Confusion with Test Reports**: Be aware that **code coverage reports** (which show which lines of your *app's source code* were executed) are different from **test execution reports** (which show if your *Cypress tests* passed or failed, often generated by reporters like `mochawesome`).

If your project uses a different framework or bundler (like Vite or Angular), the core principles are the same, but the instrumentation method will differ. For component testing, the setup is similar but involves configuring the component dev server for instrumentation.

If you can share which front-end framework or build tool (e.g., React with Vite, Angular, plain JavaScript) your project uses, I can offer more specific guidance on the instrumentation step.