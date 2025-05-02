describe('Rename Header Test', () => {
  it('should successfully click the h2, change the text, and save it', () => {
    cy.visit("/")
    cy.get('#renameField').should('have.text', 'Rename Me')
    cy.get('#renameField').click();
    cy.get('#inputForHeader').type('Testing Header Rename').type('{enter}')
    cy.get('#renameField').should('have.text', 'Testing Header Rename')
  })
})