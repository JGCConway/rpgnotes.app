describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
    cy.uploadNote('dropdownTest.json','1st: Downloaded Note')
    cy.sortBy('Newest to Oldest', 'Created: May 2, 2025 at 2:01 PMLast Edited: May 2, 2025 at 2:02 PM')
    cy.sortBy('Oldest to Newest', 'Created: May 1, 2025 at 2:04 PMLast Edited: May 1, 2025 at 2:08 PM')
    cy.sortBy('Last Edited', 'Created: May 2, 2025 at 2:01 PMLast Edited: May 2, 2025 at 2:02 PM')
  })
})
