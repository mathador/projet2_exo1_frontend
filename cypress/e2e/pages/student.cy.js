/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

context('student page', () => {

    before(() => {
    })

    beforeEach(() => {
        cy.connectWithTheUser();
        cy.visit(Cypress.env('baseUrl') + Cypress.env('student_url'))
    })

    it('check input controls, errors labels and buttons', () => {
        cy.title().should('include', 'EtudiantFrontend')
        cy.getByDataCy('firstName').should('exist')
        cy.getByDataCy('lastName').should('exist')
        cy.getByDataCy('level').should('exist')
        cy.getByDataCy('matter').should('exist')
        cy.getByDataCy('btn-submit').should('exist')
        cy.getByDataCy('btn-cancel').should('exist')
    })

    it('try to add student without firstName', () => {
        //const randomFirstName = faker.person.firstName();
        const randomLastName = faker.person.lastName();
        const randomLevel = faker.number.int({ min: 1, max: 5 }).toString();
        const randomMatter = faker.word.noun();

        //cy.getByDataCy('firstName').type(randomFirstName)
        cy.getByDataCy('lastName').type(randomLastName)
        cy.getByDataCy('level').type(randomLevel)
        cy.getByDataCy('matter').type(randomMatter)
        cy.getByDataCy('btn-submit').click()
        cy.getByDataCy('firstNameError').should('exist')
    })

    it('try to add student', () => {
        const randomFirstName = faker.person.firstName();
        const randomLastName = faker.person.lastName();
        const randomLevel = faker.number.int({ min: 1, max: 5 }).toString();
        const randomMatter = faker.word.noun();

        cy.getByDataCy('firstName').type(randomFirstName)
        cy.getByDataCy('lastName').type(randomLastName)
        cy.getByDataCy('level').type(randomLevel)
        cy.getByDataCy('matter').type(randomMatter)
        cy.getByDataCy('btn-submit').click()
        //cy.routeMatches('**/students').its('status').should('eq', 200)
        cy.url().should('contain', 'students')

        cy.get('tr').filter((_, tr) => {
            const t = tr.innerText;
            return t.includes(randomFirstName) && t.includes(randomLastName);
        }).first()
            .find('td')
            .first()
            .invoke('text')
            .then(id => {
                const idStudent = id.trim();
                // usage

                it('check input controls are fullfiled with data', () => {
                    cy.getByDataCy('firstName').should('have.value', randomFirstName)
                    cy.getByDataCy('lastName').should('have.value', randomLastName)
                    cy.getByDataCy('level').should('have.value', randomLevel)
                    cy.getByDataCy('matter').should('have.value', randomMatter)
                })

                it('try to modify student', () => {
                    cy.visit(Cypress.env('baseUrl') + Cypress.env('student_url') + '?id=' + idStudent)
                    const newFakerFirstName = faker.person.firstName();
                    cy.getByDataCy('firstName').type(newFakerFirstName)

                    cy.getByDataCy('btn-submit').click()
                    cy.visit(Cypress.env('baseUrl') + Cypress.env('student_url') + '?id=' + idStudent)
                    cy.getByDataCy('firstName').should('exist').should('have.value', newFakerFirstName)
                });
            })
    })
})