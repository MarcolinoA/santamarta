describe("SignUp page", () => {
	it('should render all the fields', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="name"]').should('be.visible');
		cy.get('[data-id="surname"]').should('be.visible');
		cy.get('[data-id="username"]').should('be.visible');
		cy.get('[data-id="password"]').should('be.visible');
		cy.get('[data-id="confirmPassword"]').should('be.visible');
		cy.get('[data-id="email"]').should('be.visible');
		cy.get('[data-id="confirmEmail"]').should('be.visible');

		// cy.get('[data-id="textLink"]').invoke('css', 'overflow', 'visible').should('be.visible');
	});

	it('should show an error if passwords do not match', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="name"]').type('Test');
		cy.get('[data-id="surname"]').type('Test');
		cy.get('[data-id="username"]').type('Test');
		cy.get('[data-id="password"]').type('password123');
		cy.get('[data-id="confirmPassword"]').type('password321');
		cy.get('[data-id="email"]').type('test@gmail.com');
		cy.get('[data-id="confirmEmail"]').type('test@gmail.com');
		 
		cy.get('[data-id="submit-btn"]').click();
	
		cy.get('[data-id="error-message"]').should('contain', 'Le password non corrispondono');
	});

	it('should show an error if emails do not match', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="name"]').type('Test');
		cy.get('[data-id="surname"]').type('Test');
		cy.get('[data-id="username"]').type('Test');
		cy.get('[data-id="password"]').type('password123');
		cy.get('[data-id="confirmPassword"]').type('password123');
		cy.get('[data-id="email"]').type('test1@gmail.com');
		cy.get('[data-id="confirmEmail"]').type('test@gmail.com');
		 
		cy.get('[data-id="submit-btn"]').click();
	
		cy.get('[data-id="error-message"]').should('contain', 'Le email non corrispondono');
	});

	it('should render to verification page if the submit was written well', () => {
		cy.visit('/account/pages/signup');
		cy.get('[data-id="name"]').type('Test');
		cy.get('[data-id="surname"]').type('Test');
		cy.get('[data-id="username"]').type('Test');
		cy.get('[data-id="password"]').type('password123');
		cy.get('[data-id="confirmPassword"]').type('password123');
		cy.get('[data-id="email"]').type('test@gmail.com');
		cy.get('[data-id="confirmEmail"]').type('test@gmail.com');
	
		cy.intercept('POST', 'http://localhost:5555/users/register', {
			statusCode: 200, 
			body: { message: 'User registered successfully' }, 
		}).as('registerUser');
	
		cy.get('[data-id="submit-btn"]').click();
	
		// Wait for the API call to complete
		cy.wait('@registerUser').its('response.statusCode').should('eq', 200);
	
		// Check if we redirected to the verification page
		cy.url({ timeout: 10000 }).should('include', '/account/other/accountVerification');
	});
})