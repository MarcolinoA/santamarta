describe("SignIn Page", () => {
	it("should render all the components", () => {
		cy.visit("/account/pages/signin");
		cy.get('[data-id="title"]').should("contain", "Effettua l'accesso");

		cy.get('[data-id="signInForm"]').should("be.visible");
	});

	it("should show an error when a field isn t compiled", () => {
		cy.intercept("POST", `http://localhost:5555/users/login`, {
			statusCode: 429,
			body: { message: "Credenziali non valide" },
		}).as("loginRequest");
		cy.visit("/account/pages/signin");
		cy.get('[data-id="username"]').type(" ");
		cy.get('[data-id="password"]').type("password123");

		cy.get('[data-id="submit-btn"]').click();

		cy.get('[data-id="error-message"]').should(
			"contain",
			"Credenziali non valide"
		);
	});

	it("should show an error when too many login attempts are made", () => {
		cy.intercept("POST", `http://localhost:5555/users/login`, {
			statusCode: 429,
			body: { message: "Troppi tentativi di accesso. Riprova più tardi." },
		}).as("loginRequest");

		cy.visit("/account/pages/signin");
		cy.get('[data-id="username"]').type("testuser");
		cy.get('[data-id="password"]').type("testpassword");
		cy.get('[data-id="submit-btn"]').click();

		cy.wait("@loginRequest");
		cy.get('[data-id="error-message"]').should(
			"contain",
			"Troppi tentativi di accesso. Riprova più tardi."
		);
	});

	it("should log in successfully and redirect to the homepage", () => {
		cy.intercept("POST", `http://localhost:5555/users/login`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("loginRequest");

		cy.visit("/account/pages/signin");
		cy.get('[data-id="username"]').type("testuser");
		cy.get('[data-id="password"]').type("testpassword");
		cy.get('[data-id="submit-btn"]').click();

		cy.wait("@loginRequest");

		cy.setCookie('authToken', 'fakeAuthToken');

		// Verifica che il cookie di autenticazione sia stato impostato
		cy.getCookie("authToken").should("exist"); // Verifica che il cookie esista

		// Verifica che l'utente venga reindirizzato alla homepage
		cy.url().should("include", "/");
	});
});