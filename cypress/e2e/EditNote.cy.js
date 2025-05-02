describe('Edit Note Test', () => {
  it('Should be able to successfully edit existing notes and save them', () => {
    cy.visit("/")
    cy.addNote('This note WILL be edited!');
    cy.wait(6100); // 60 second timer: 60000  | 3 second timer: 3000
    cy.editNote('This is a note that has been edited');
  })
})