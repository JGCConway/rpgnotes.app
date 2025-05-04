describe('Upload Notes Test', () => {
  
  it('Should successfully allow for the uploading of properly formatted JSON files.', () => {
    cy.visit('/')
    cy.uploadNote('importTest.json', '1st: Downloaded Note')
  });
})