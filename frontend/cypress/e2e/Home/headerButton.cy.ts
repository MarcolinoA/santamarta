describe("header button functionality", () => {
	// simula la funzionalità generale del bottone
	it("should verify the header btn functionality", () => {
		cy.visit("/");
	
		cy.get('[data-id="header-btn"]').click(); // Clicca sul bottone header
		cy.get('[data-id="signin-btn"]').click(); // Clicca sul bottone di accesso
	
		cy.url().should('include', '/account/pages/signin'); // Verifica che l'URL contenga la pagina di accesso
	});

	// il dropdown deve essere correttamente funzionante
	it('should toggle dropdown visibility on icon click', () => {
		cy.visit("/");
		cy.get('[data-id="header-btn"]').click();
		cy.get('[data-id="dropdown-content"]').should('be.visible');
		cy.get('[data-id="header-btn"]').click();
		cy.get('[data-id="dropdown-content"]').should('not.exist');
	});

	// dopo aver eseguito l'accesso bisogna mostrare il messaggio di benvenuto
	it('should display the correct username when authenticated', () => {
		// simula l'auth
		cy.intercept('GET', 'http://localhost:5555/users/verify-token', {
			statusCode: 200,
			body: {
				priority: false,
			}
		}).as("getAuthToken");

		cy.setCookie("authToken", "test-token");
		cy.setCookie("username", "testUser");

		cy.visit("/");

		cy.get('[data-id="header-btn"]').click();
		cy.get('[data-id="dropdown-content"]').should('contain', 'Ciao, testUser');
	});

	// test per verificare l'assenza del messaggio di benuto quando non viene effettuato l'accesso
	it('should show the logo when the user is not authenticated', () => {
		cy.visit("/");
		cy.get('[data-id="header-btn"]').click();
		cy.get('[data-id="header-logo"]').should('be.visible');
	});

	it("should close the dropdown menu when the user clicks outside", () => {
		cy.visit("/");
		cy.get('[data-id="header-btn"]').click(); // Apri il dropdown
		cy.get('[data-id="dropdown-content"]').should('be.visible'); // Verifica che il dropdown sia visibile

		// Simula un clic al di fuori del dropdown
		cy.get('body').click(100, 100); // Clicca in una posizione specifica
		cy.get('[data-id="dropdown-content"]').should('not.exist'); // Verifica che il dropdown non esista più nel DOM
	});
});