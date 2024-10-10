describe('Card', () => { 
	it('should render all the elements', () => {
		cy.visit("/");

		cy.get('[data-id="card-container-fattoria-didattica"]').should('be.visible');
		cy.get('[data-id="card-front-fattoria-didattica"]').should('be.visible');
		cy.get('[data-id="card-name-fattoria-didattica"]').should('contain', 'Fattoria didattica');
		cy.get('[data-id="fattoria-didattica"]').should('be.visible');
	});

	it('should render and toggle correctly the big card', () => {
		cy.visit("/");

		cy.get('[data-id="fattoria-didattica"]').should('be.visible');
		cy.get('[data-id="fattoria-didattica"]').click();
		cy.get('[data-id="card-back-fattoria-didattica"]').should('be.visible');

		cy.get('[data-id="card-back-fattoria-didattica"]').click();
		cy.get('[data-id="fattoria-didattica"]').should('be.visible');
	});

	it('should switch correctly a card', () => {
		cy.visit("/");

		cy.get('[data-id="fattoria-didattica"]').should('be.visible');
		cy.get('[data-id="laboratorio-musicale"]').should('be.visible');

		cy.get('[data-id="laboratorio-musicale"]').click();
		cy.get('[data-id="laboratorio-musicale"]').click();
		cy.get('[data-id="card-back-laboratorio-musicale"]').should('be.visible');
	});
 })