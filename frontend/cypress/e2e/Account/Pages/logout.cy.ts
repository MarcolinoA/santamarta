describe('Logout page', () => { 
	it("should logout the account", () => {
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("verifyTokenRequest");
	
		cy.intercept("POST", "http://localhost:5555/users/logout", {
			statusCode: 200,
			body: { message: "Logout successfully" },
		}).as("logoutAccountRequest");
	
		cy.setCookie("authToken", "fakeAuthToken");
		cy.setCookie("username", "testuser");
	
		cy.visit("/account/pages/logout");
	
		cy.wait("@verifyTokenRequest");
	
		cy.get('[data-id="logout-btn"]').click();
	
		cy.wait("@logoutAccountRequest");
	
		cy.url().should("eq", "http://localhost:3000/");
	});
 })