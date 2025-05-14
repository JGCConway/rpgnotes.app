describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
    cy.downloadOneNote('This note will be downloaded by itself')
  })
})