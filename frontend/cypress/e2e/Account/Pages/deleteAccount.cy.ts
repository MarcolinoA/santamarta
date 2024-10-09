describe("Delete Account", () => {
	it("should delete the account", () => {
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("verifyTokenRequest");
	
		cy.intercept("POST", "http://localhost:5555/users/deleteAccount", {
			statusCode: 200,
			body: { message: "Account deleted successfully" },
		}).as("deleteAccountRequest");
	
		cy.setCookie("authToken", "fakeAuthToken");
		cy.setCookie("username", "testuser");
	
		cy.visit("/account/pages/deleteAccount");
	
		cy.wait("@verifyTokenRequest");
	
		cy.get('[data-id="delete-btn"]').click();
	
		cy.wait("@deleteAccountRequest");
	
		cy.url().should("eq", "http://localhost:3000/");
	});

	it("should show an error when the delete account route fails", () => {
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("verifyTokenRequest");
	
		cy.intercept("POST", "http://localhost:5555/users/deleteAccount", {
			statusCode: 400,
			body: { message: "Eliminazione dell'account fallita" }, // Aggiungi un corpo valido
		}).as("deleteAccountRequest");
	
		cy.setCookie("authToken", "fakeAuthToken");
		cy.setCookie("username", "testuser");
	
		cy.visit("/account/pages/deleteAccount");
	
		cy.wait("@verifyTokenRequest");
	
		cy.get('[data-id="delete-btn"]').click();
	
		cy.wait("@deleteAccountRequest");
	
		cy.get('[data-id="acc-delete-err-msg"]').should('contain', "Eliminazione dell'account fallita");
	});
});