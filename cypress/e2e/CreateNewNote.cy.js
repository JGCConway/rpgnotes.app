describe('Create New Note Test', () => {
  it('Should be able to create a new note', () => {
    cy.visit("/")
    cy.addNote('This is note will not be edited');
  })
})