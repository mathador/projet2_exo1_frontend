/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("getByDataCy", (selector, ...args) => {
    return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add("checkApiConnection", (selector, ...args) => {
    cy.request({
        method: 'GET',
        url: Cypress.env('apiUrl') + Cypress.env('logout_api'),
        failOnStatusCode: false
    }).then((response) => {
        if (response.status !== 404) {
            cy.log("✅ web api ok");
        } else {
            cy.log(("❌ web api url not found: " + Cypress.env('apiUrl') + Cypress.env('logout_api')));
        }
    });
})

Cypress.Commands.add("connectWithTheUser", (selector, ...args) => {
    cy.request("POST", Cypress.env('apiUrl') + Cypress.env('login_url'), {
        "login": "d",
        "password": "d"
    }).then((response) => {
        //token = response.body.token;
        // Stockez le token dans la variable
    });
})