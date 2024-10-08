describe("Delete Account", () => {
	it("should render all the elements", () => {
		// Intercetta la richiesta alla verifica del token
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("verifyTokenRequest");

		// Imposta i cookie di autenticazione
		cy.setCookie("authToken", "fakeAuthToken");
		cy.setCookie("username", "testuser");

		// Visita la pagina di eliminazione dell'account
		cy.visit("/account/pages/deleteAccount");

		// Aspetta la richiesta di verifica del token
		cy.wait("@verifyTokenRequest");

		// Verifica che la pagina sia renderizzata correttamente
		cy.get('[data-id="delete-title"]').should("contain", "Elimina il tuo account");
		cy.get('[data-id="deleteAccForm"]').should("be.visible");
		cy.get('[data-id="delete-btn"]').should("be.visible");
	});

	it("should render a block when the user isn't auth", () => {
		// Intercetta la richiesta alla verifica del token
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 401,
			body: { username: "", authToken: "" },
		}).as("deniedRequest");

		// Imposta i cookie di autenticazione
		cy.setCookie("authToken", "");
		cy.setCookie("username", "");

		// Visita la pagina di eliminazione dell'account
		cy.visit("/account/pages/deleteAccount");

		// Verifica che la pagina sia renderizzata correttamente
		cy.get('[data-id="access-denied"]').should("contain", "Accesso Negato");
		cy.get('[data-id="session-expired"]').should("contain", "Sessione scaduta. Effettua nuovamente il login.");
	});

	it("should delete the account", () => {
		// Simula che l'utente sia autenticato
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("verifyTokenRequest");
	
		// Simula la richiesta di eliminazione dell'account con una risposta JSON valida
		cy.intercept("POST", "http://localhost:5555/users/deleteAccount", {
			statusCode: 200,
			body: { message: "Account deleted successfully" }, // Aggiungi un corpo valido
		}).as("deleteAccountRequest");
	
		// Imposta i cookie di autenticazione
		cy.setCookie("authToken", "fakeAuthToken");
		cy.setCookie("username", "testuser");
	
		// Visita la pagina di eliminazione dell'account
		cy.visit("/account/pages/deleteAccount");
	
		// Aspetta la richiesta di verifica del token
		cy.wait("@verifyTokenRequest");
	
		// Clicca sul pulsante di eliminazione
		cy.get('[data-id="delete-btn"]').click();
	
		// Aspetta la richiesta di eliminazione dell'account
		cy.wait("@deleteAccountRequest");
	
		// Verifica che l'utente sia stato reindirizzato alla homepage
		cy.url().should("eq", "http://localhost:3000/");
	});

	it("should show an error when the delete account route fails", () => {
		// Simula che l'utente sia autenticato
		cy.intercept("GET", `http://localhost:5555/users/verify-token`, {
			statusCode: 200,
			body: { username: "testuser", authToken: "fakeAuthToken" },
		}).as("verifyTokenRequest");
	
		// Simula la richiesta di eliminazione dell'account con una risposta JSON valida
		cy.intercept("POST", "http://localhost:5555/users/deleteAccount", {
			statusCode: 400,
			body: { message: "Eliminazione dell'account fallita" }, // Aggiungi un corpo valido
		}).as("deleteAccountRequest");
	
		// Imposta i cookie di autenticazione
		cy.setCookie("authToken", "fakeAuthToken");
		cy.setCookie("username", "testuser");
	
		// Visita la pagina di eliminazione dell'account
		cy.visit("/account/pages/deleteAccount");
	
		// Aspetta la richiesta di verifica del token
		cy.wait("@verifyTokenRequest");
	
		// Clicca sul pulsante di eliminazione
		cy.get('[data-id="delete-btn"]').click();
	
		// Aspetta la richiesta di eliminazione dell'account
		cy.wait("@deleteAccountRequest");
	
		cy.get('[data-id="acc-delete-err-msg"]').should('contain', "Eliminazione dell'account fallita");
	});
	
});