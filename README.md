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
