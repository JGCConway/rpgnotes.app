// ***********************************************
// This example commands.js shows you how to
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
import 'cypress-downloadfile/lib/downloadFileCommand.js'
import 'cypress-file-upload';


Cypress.Commands.add('addNote', (text) => {
  cy.get('i#addIcon').should('be.visible');
    cy.get('#addIcon').click();
    cy.get('#note-text').type(text);
    cy.get('#save-note-btn').click();
    cy.get('#existingtextarea').should('have.value', text)
  });

Cypress.Commands.add('editNote', (text) => {
    cy.get('.edit-btn').should('have.text', 'Edit')
    cy.get('.edit-btn').click();
    cy.get('#existingtextarea').click();
    cy.get('#existingtextarea').clear();
    cy.get('#existingtextarea').type(text);
    cy.get('#existingtextarea').should('have.value', text)
    cy.get('.save-btn').click({ multiple: true, force: true });
    cy.get('.edit-btn').click();
  });

  Cypress.Commands.add('uploadNote', (jsonFile) => {
    cy.get('#upload-notes-btn').should('have.text', 'Upload Notes')
    cy.wait(3000)
    cy.get('input[type="file"]')
    .attachFile(jsonFile)
    .trigger('change', { force: true });
    cy.get('#existingtextarea').should('have.value', '1st: Downloaded Note')
  });

    Cypress.Commands.add('downloadNote', () => {
      cy.get('#download-notes-btn').should('have.text', 'Download Notes')
      cy.wait(3000)
      cy.addNote('1st: Downloaded Note');
      cy.get('#download-notes-btn').click()
  });

  Cypress.Commands.add('deleteNote', () => {
    cy.get('.delete-btn').should('have.text', 'Delete')
    cy.wait(1000);
    cy.get('.delete-btn').click();
    cy.reload()
    cy.wait(3000);
});