describe('Input Field Props', () => { 
	it('should render the input field', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="name"]').should('exist');
		cy.get('[data-id="name"]')
		.should('have.attr', 'name', 'name')
		.and('have.attr', 'type', 'text')
		.and('have.attr', 'required');
	});

	it('should allow typing in the input field', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="name"]').should('exist');
 
		cy.get('[data-id="name"]').type('John').should('have.value', 'John');
 });

 it('should prevent form submission if required fields are empty', () => {
	cy.visit('/account/pages/signup');
	cy.get('[data-id="submit-btn"]').click();

	cy.url().should('include', '/signup');
});

	it('should render the showPasswordToggle button when showPasswordToggle is true', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="password"]').should('exist');

		cy.get('[data-id="password"]')
			.parent()
			.find('[data-id="passwordToggle"]')
			.should('exist');

			cy.get('[data-id="name"]')
			.parent()
			.find('[data-id="passwordToggle"]')
			.should('not.exist');
	});

	it('should show the password when the toggle button is clicked', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="password"]').should('exist');

		cy.get('[data-id="password"]').type('hello').should('have.attr', 'type','password')

		cy.get('[data-id="password"]')
			.parent()
			.find('[data-id="passwordToggle"]')
			.click();

			cy.get('[data-id="password"]')
			.should('have.attr', 'type','text');
	});

	it("should hide the password when the toggle button is clicked", () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="password"]').should('exist');

		cy.get('[data-id="password"]')
		.parent()
		.find('[data-id="passwordToggle"]')
		.click();

		cy.get('[data-id="password"]').type('hello').should('have.attr', 'type','text')

		cy.get('[data-id="password"]')
		.parent()
		.find('[data-id="passwordToggle"]')
		.click();

		cy.get('[data-id="password"]')
			.should('have.attr', 'type','password');
	});

})