describe("Reset Data", () => {
	it("should render all the elements", () => {
		cy.visit("/account/password/resetPassword");

		cy.get('[data-id="rv-title"]').should("contain.text", "Reimposta");
		cy.get('[data-id="rv-desc"]').should(
			"contain.text",
			"Inserisci il codice OTP"
		);

		cy.get('[data-id="otp"]').should("exist");
		cy.get('[data-id="newValue"]').should("exist");
		cy.get('[data-id="confirmValue"]').should("exist");

		cy.get('[data-id="rv-btn"]').should("contain.text", "Reimposta");

		cy.get('[data-id="textLink"]').should("contain.text", "Torna alla Home");
	});

	it("should show loading state while submitting", () => {
		cy.intercept("POST", `http://localhost:5555/otp/reset-password`, {
			statusCode: 200,
			body: { message: "Password reimpostata con successo!" },
		}).as("resetPassword");

		cy.visit("/account/password/resetPassword");

		cy.get('[data-id="otp"]').should("be.visible").type("123456");
		cy.get('[data-id="newValue"]').type("newPassword123");
		cy.get('[data-id="confirmValue"]').type("newPassword123");

		cy.get('[data-id="rv-btn"]').click();
	});

	it("should show an error if newValue and confirmValue do not match", () => {
		cy.visit("/account/password/resetPassword");

		cy.get('[data-id="otp"]').should("be.visible").type("123456");
		cy.get('[data-id="newValue"]').type("newPassword123");
		cy.get('[data-id="confirmValue"]').type("differentPassword123"); // Inserisci un valore diverso
		cy.get('[data-id="rv-btn"]').click();

		cy.get('[data-id="error-message"]').should(
			"contain",
			"le password non coincidono."
		);
	});
});
