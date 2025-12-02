/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

context('register page', () => {

    before(() => {
        cy.checkApiConnection();
    })

    beforeEach(() => {
        cy.visit(Cypress.env('baseUrl') + Cypress.env('register_url'))
    })

    it('check input controls, errors labels and buttons', () => {
        cy.title().should('include', 'EtudiantFrontend')
        cy.getByDataCy('firstName').should('exist')
        cy.getByDataCy('lastName').should('exist')
        cy.getByDataCy('login').should('exist')
        cy.getByDataCy('password').should('exist')
        cy.getByDataCy('btn-valider').should('exist')
        cy.getByDataCy('btn-annuler').should('exist')
    })

    it('click valider without any field fullfilled', () => {
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('firstName').should('have.class', 'is-invalid')
        cy.getByDataCy('lastName').should('have.class', 'is-invalid')
        cy.getByDataCy('login').should('have.class', 'is-invalid')
        cy.getByDataCy('password').should('have.class', 'is-invalid')
    })

    it('click valider without password field fullfilled', () => {
        cy.getByDataCy('firstName').type('MyLogin')
        cy.getByDataCy('lastName').type('MyLogin')
        cy.getByDataCy('login').type('MyLogin')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('password').should('have.class', 'is-invalid')
    })

    it('click valider without login field fullfilled', () => {
        cy.getByDataCy('firstName').type('MyLogin')
        cy.getByDataCy('lastName').type('MyLogin')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('login').should('have.class', 'is-invalid')
    })

    it('click valider without firstName field fullfilled', () => {
        cy.getByDataCy('lastName').type('MyLogin')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('firstName').should('have.class', 'is-invalid')
    })

    it('click valider without lastName field fullfilled', () => {
        cy.getByDataCy('firstName').type('MyLogin')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('lastName').should('have.class', 'is-invalid')
    })

    it('click cancel clear all fields', () => {
        cy.getByDataCy('firstName').type('MyLogin')
        cy.getByDataCy('lastName').type('MyLogin')
        cy.getByDataCy('login').type('MyLogin')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-annuler').click()
        cy.getByDataCy('firstName').should('have.value', '')
        cy.getByDataCy('lastName').should('have.value', '')
        cy.getByDataCy('login').should('have.value', '')
        cy.getByDataCy('password').should('have.value', '')
    })

    it('try to register with existing user', () => {
        cy.getByDataCy('firstName').type('MyLogin')
        cy.getByDataCy('lastName').type('MyLogin')
        cy.getByDataCy('login').type('d')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-valider').click()
        // TODO problème à résoudre avec l'api ou frontend
        cy.getByDataCy('erreur_inscription').should('exist')
    })


    it('try to log with a brand new user', () => {
        const randomFirstName = faker.person.firstName();
        const randomLastName = faker.person.lastName();
        const randomLogin = faker.internet.email({ firstName: randomFirstName, lastName: randomLastName });
        const randomPassword = faker.internet.password({ length: 12 });

        cy.getByDataCy('firstName').type(randomFirstName)
        cy.getByDataCy('lastName').type(randomLastName)
        cy.getByDataCy('login').type(randomLogin)
        cy.getByDataCy('password').type(randomPassword)
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('succes_inscription').should('exist')
    })   
})