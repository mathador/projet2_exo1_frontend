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

Vous deviendez pouvoir tester le fonctionnement avec cette première url:
[http://localhost:4200/login]()

# Pour les tests unitaires

RAS


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
console.log('Name:', randomName); //peut retourner par exemple ‘Christine Dupont’
```
