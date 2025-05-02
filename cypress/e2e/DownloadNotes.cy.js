describe('Download Note Button Test', () => {
  it('should successfully download my-notes.json', () => {
    cy.visit('/');
    cy.downloadNote();
  })
})