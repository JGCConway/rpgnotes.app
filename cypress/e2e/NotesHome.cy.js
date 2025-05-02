describe('template spec', () => {
  it('passes', () => {
    cy.visit("/")
    cy.get('#addIcon').click();
    cy.get('#note-text').type('This is an original testing note');
    cy.get('#save-note-btn').click();
    cy.wait(3000); // 60 second timer: 60000  | 3 second timer: 3000
    cy.get('.edit-btn').click();
    cy.get('#existingtextarea').click();
    cy.get('#existingtextarea').clear();
    cy.get('#existingtextarea').type('This is a note that has been edited');
    cy.get('.save-btn').click({ multiple: true, force: true });
    cy.get('#addIcon').click();
    cy.get('#note-text').type('This is an original testing note');
    cy.get('#save-note-btn').click();
    cy.get('#renameField').click();
    cy.get('#inputForHeader').type('Testing Header Rename').type('{enter}')
  })
})