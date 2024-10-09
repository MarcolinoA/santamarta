describe('Recover Data', () => { 
	it('should render all the elements', () => {
		cy.visit("/account/password/recoverPassword");
		
		cy.get('[data-id="rd-title"]').should("exist");
		cy.get('[data-id="rd-desc"]').should("exist");
		cy.get('[data-id="rd-form"]').should("exist");
		cy.get('[data-id="fd-title"]').should("exist");
	});

	it("should send the email correctly", () => {
		cy.intercept("POST", `http://localhost:5555/otp/forgot-data`, {
			statusCode: 200,
			body: { email: "test@gmail.com" },
		}).as("sendEmail");

		cy.visit("/account/password/recoverPassword");

		cy.get('[data-id="email"]').type('test@gmail.com').should('have.attr', 'type','email');
		cy.get('[data-id="fd-title"]').click();

		cy.wait("@sendEmail");

		cy.get('[data-id="error-message"]').should("contain", `Controlla la tua email per reimpostare la tua password`);
	});
 })