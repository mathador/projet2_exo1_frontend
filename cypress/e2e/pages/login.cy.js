/// <reference types="cypress" />

context('login page', () => {

    before(() => {
        cy.checkApiConnection();
    })

    beforeEach(() => {
        const url = Cypress.env('baseUrl') + Cypress.env('login_url');
        //cy.log(url);
        cy.visit(url);
    })

    it('check input controls, errors labels and buttons', () => {
        cy.title().should('include', 'EtudiantFrontend')
        cy.getByDataCy('login').should('exist')
        cy.getByDataCy('password').should('exist')
        cy.getByDataCy('btn-valider').should('exist')
        cy.getByDataCy('btn-annuler').should('exist')
    })

    it('click valider without any field fullfilled', () => {
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('login').should('have.class', 'is-invalid')
        cy.getByDataCy('password').should('have.class', 'is-invalid')
    })

    it('click valider without password field fullfilled', () => {
        cy.getByDataCy('login').type('MyLogin')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('password').should('have.class', 'is-invalid')
    })

    it('click valider without login field fullfilled', () => {
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('login').should('have.class', 'is-invalid')
    })

    it('click cancel clear all fields', () => {
        cy.getByDataCy('login').type('MyLogin')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-annuler').click()
        cy.getByDataCy('login').should('have.value', '')
        cy.getByDataCy('password').should('have.value', '')
    })

    it('try to log with existing user but wrong password', () => {
        cy.getByDataCy('login').type('d')
        cy.getByDataCy('password').type('MyPassword')
        cy.getByDataCy('btn-valider').click()
        // TODO problème à résoudre avec l'api ou frontend
        cy.getByDataCy('btn-register').should('exist')
    })


    it('try to log with existing user and good password', () => {
        cy.getByDataCy('login').type('d')
        cy.getByDataCy('password').type('d')
        cy.getByDataCy('btn-valider').click()
        cy.getByDataCy('btn-logout').should('exist')
    })
})