describe('SignIn Page', () => { 
	it('should render all the components', () => {
		cy.visit('/account/pages/signin');
		cy.get('[data-id="title"]').should('contain', "Effettua l'accesso");

		cy.get('[data-id="signInForm"]').should('be.visible');
	});

	it('should show an error when a field isn t compiled', () => {
		cy.visit('/account/pages/signin');
		cy.get('[data-id="username"]').type(' ');
		cy.get('[data-id="password"]').type('password123');

		cy.get('[data-id="submit-btn"]').click();

		cy.get('[data-id="error-message"]').should('contain', 'Credenziali non valide');
	});

	it('should show an error when too many login attempts are made', () => {
		cy.intercept('POST', `http://localhost:5555/users/login`, {
				statusCode: 429,
				body: { message: "Troppi tentativi di accesso. Riprova più tardi." },
		}).as('loginRequest');

		cy.visit('/account/pages/signin');
		cy.get('[data-id="username"]').type('testuser');
		cy.get('[data-id="password"]').type('testpassword');
		cy.get('[data-id="submit-btn"]').click();

		cy.wait('@loginRequest');
		cy.get('[data-id="error-message"]').should('contain', 'Troppi tentativi di accesso. Riprova più tardi.');
});
 })

 /**
2. Test degli eventi di input
Verifica che gli utenti possano inserire correttamente il loro username e password.

5. Test della chiamata API di login e gestione degli errori
Verifica che l'applicazione gestisca correttamente la chiamata API per il login e mostri errori se le credenziali sono errate.

6. Test del login corretto e reindirizzamento
Verifica che un login corretto reindirizzi l'utente alla homepage.

7. Test della navigazione
Verifica che i link sulla pagina (es. il link per la registrazione) funzionino correttamente.
  */