describe('FormPageLayout Component', () => {
  it('should render the form page layout with the title, button, and header', () => {
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
      statusCode: 200,
      body: { username: "testuser", authToken: "fakeAuthToken" },
    }).as("verifyTokenRequest");

    cy.setCookie("authToken", "fakeAuthToken");
    cy.setCookie("username", "testuser");

		cy.visit('/account/pages/logout');

    cy.wait("@verifyTokenRequest");

    cy.get('[data-id="page-title"]').should('contain', 'Logout');

    cy.get('[data-id="logout-btn"]').should('contain', 'Logout');

    cy.get('[data-id="header-btn"]').should('exist');
  });
});
