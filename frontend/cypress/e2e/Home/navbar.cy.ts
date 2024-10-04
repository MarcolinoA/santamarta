describe('navbar test', () => {
  beforeEach(() => {
    // Simula l'utente autenticato se necessario per far comparire tutti i link
    cy.setCookie('auth', 'true');
    cy.visit('/');
  });

  it('should display the navbar', () => {
    cy.get('[data-id="nav-links-container"]').should("be.visible");
  });

  it('should contain all necessary links', () => {
    const links = ['La scuola', 'Orari', 'Area riservata', 'Contatti', 'Modulistica'];
    
    // Aspetta che il container dei link sia visibile prima di fare l'assert
    cy.get('[data-id="nav-links-container"]').should('be.visible');

    links.forEach(link => {
      cy.contains(link).should('be.visible');
    });
    
  });

  it('should display authenticated-only links when user is authenticated', () => {
    // Simula l'utente autenticato e controlla che il link "Roma" sia visibile
    cy.get('[data-id="nav-links-container"]').contains('Roma').should('be.visible');
  });
})