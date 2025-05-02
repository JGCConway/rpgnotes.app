describe('Delete Note Test', () => {
  it('Should be able to delete an existing note', () => {
    cy.visit("/")
    cy.addNote('Testing Delete Function');
    cy.deleteNote();

  })
})