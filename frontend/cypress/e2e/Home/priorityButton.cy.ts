describe("Priority Button", () => {
	it("should verify the priority btn functionality", () => {
		// simula l'auth
		cy.intercept("GET", "http://localhost:5555/users/verify-token", {
			statusCode: 200,
			body: {
				priority: true,
			},
		}).as("getAuthToken");

		cy.setCookie("authToken", "test-token");
		cy.setCookie("username", "testUser");
		
		cy.visit("/");

		cy.get('[data-id="priority-btn"]').click();

		cy.url().should("include", "/home/homePageEdit");
	});

	it("should hide the priority btn when the user don't have the priority", () => {
		// simula l'auth
		cy.intercept("GET", "http://localhost:5555/users/verify-token", {
			statusCode: 200,
			body: {
				priority: false,
			},
		}).as("getAuthToken");

		cy.setCookie("authToken", "test-token");
		cy.setCookie("username", "testUser");
		
		cy.visit("/");

		cy.get('[data-id="priority-btn"]').should('not.exist');
	});

	it("should not render the priority button when there is an authentication error", () => {
		cy.intercept("GET", "http://localhost:5555/users/verify-token", {
			statusCode: 500,
			body: {},
		}).as("getAuthToken");
	
		cy.visit("/");
	
		cy.get('[data-id="priority-btn"]').should('not.exist');
	});
});
