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

Procédure compacte. Suppose un projet JS/TS avec bundler (Webpack, Vite, ou similaire).

1. Installe l’instrumentation.

```
npm install --save-dev babel-plugin-istanbul
```

2. Active l’instrumentation dans Babel pour l’environnement “test-e2e”.
   `babel.config.js` :

```js
module.exports = {
  presets: ["@babel/preset-env"],
  env: {
    "coverage": {
      plugins: ["istanbul"]
    }
  }
}
```

3. Force le bundler à utiliser cet environnement lors du build servi à Cypress.
   Exemple via variable :

```
BABEL_ENV=coverage npm run build
```

4. Lance Cypress en headless sur ce bundle instrumenté.

```
npx cypress run
```

5. Récupère la sortie brute de couverture (généralement `.nyc_output/out.json` ou `coverage/coverage-final.json` selon config).

6. Génère le rapport.
   Installe nyc si absent :

```
npm install --save-dev nyc
```

Puis :

```
npx nyc report --reporter=html --reporter=text-summary
```

Le rapport HTML apparaît dans `coverage/`.
