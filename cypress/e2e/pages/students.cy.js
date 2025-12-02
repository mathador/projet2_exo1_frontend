/// <reference types="cypress" />
import { faker } from '@faker-js/faker';

context('students page', () => {

    beforeEach(() => {
        cy.connectWithTheUser();
        cy.visit(Cypress.env('baseUrl') + Cypress.env('students_url'))
    })

    it('check input controls, errors labels and buttons', () => {
        cy.title().should('include', 'EtudiantFrontend')
        cy.getByDataCy('btn-create-student').should('exist')
        cy.getByDataCy('students-table').should('exist')
    })

    it('try to remove student, and confirm', () => {

        cy.get('table tr')
            .last()
            .find('td')
            .first()
            .invoke('text')
            .then(t => {
                const idStudent = t.trim();
                cy.log('ID of student to delete: ' + idStudent);

                cy.get('table tr')
                    .last()
                    .within(() => {
                        cy.contains('button', 'Supprimer').click();
                    });

                cy.on('window:confirm', () => true);

                cy.get('table tr')
                    .last()
                    .find('td')
                    .first()
                    .invoke('text')
                    .should('not.equal', idStudent);
            });
    });

    it('try to remove student but finally cancel', () => {

        cy.get('table tr')
            .last()
            .find('td')
            .first()
            .invoke('text')
            .then(t => {
                const idStudent = t.trim();
                cy.log('ID of student to delete: ' + idStudent);

                cy.get('table tr')
                    .last()
                    .within(() => {
                        cy.contains('button', 'Supprimer').click();
                    });

                cy.on('window:confirm', () => false);

                cy.get('table tr')
                    .last()
                    .find('td')
                    .first()
                    .invoke('text')
                    .should('equal', idStudent);
            });
    });

    it('create new student', () => {
        cy.getByDataCy('btn-create-student').click()
        cy.url()
            .should('contain', 'student')
            .and('not.contain', 'students')
            // ici on ne va pas au bout de la création car celà serait redondant avec les tests du fichier student.cy.js
    })
})