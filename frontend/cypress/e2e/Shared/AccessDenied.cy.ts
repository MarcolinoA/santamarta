describe('Access Denied', () => { 
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
 })