// ***********************************************
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-downloadfile/lib/downloadFileCommand.js'
import 'cypress-file-upload';

// ********Add Note********
Cypress.Commands.add('addNote', (text) => {
  cy.get('i#addIcon').should('be.visible');
    cy.get('#addIcon').click();
    cy.get('#note-text').type(text);
    cy.get('#save-note-btn').click();
    cy.get('#existingtextarea').should('have.value', text)
  });


// ********Edit Note********
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

  // ********Upload Note********
  Cypress.Commands.add('uploadNote', (jsonFile,uploadedNote) => {
    cy.get('#upload-notes-btn').should('have.text', 'Upload Notes')
    cy.wait(3000)
    cy.get('input[type="file"]')
    .attachFile(jsonFile)
    .trigger('change', { force: true });
    cy.get('#existingtextarea').should('have.value', uploadedNote)
  });

  // ********Download ALL Notes********
    Cypress.Commands.add('downloadAllNotes', () => {
      cy.get('#download-notes-btn').should('have.text', 'Download Notes')
      cy.wait(3000)
      cy.addNote('1st: Downloaded Note');
      cy.get('#download-notes-btn').click()
  });
  // ********Download ONE Note********
  Cypress.Commands.add('downloadOneNote', (oneAddedNote) => {
    cy.visit('/')
    cy.addNote(oneAddedNote)
    cy.get('.download-btn').should('have.text','Download')
    cy.get('.download-btn').click()
});

  // ********Delete Note********
  Cypress.Commands.add('deleteNote', () => {
    cy.get('.delete-btn').should('have.text', 'Delete')
    cy.wait(1000);
    cy.get('.delete-btn').click();
    cy.reload()
    cy.wait(3000);
});

  // ********Sort By********
  Cypress.Commands.add('sortBy', (sortOption, timeStamp) => {
    cy.get('#sort-notes').select(sortOption)
    cy.get('#timeStampsID').should('have.text', timeStamp)
});