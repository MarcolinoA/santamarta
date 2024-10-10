describe("Account Verification", () => {
	it("should render all the components", () => {
		cy.visit("/account/other/accountVerification");
		cy.get('[data-id="av-form"]').should("exist");
		cy.get('[data-id="av-title"]').should(
			"contain",
			"Controlla il tuo indirizzo di posta elettronica"
		);
		cy.get('[data-id="av-desc"]').should("exist");
		cy.get('[data-id="av-resend"]').should("exist");
		cy.get('[data-id="av-link"]').should("exist");
	});

	it("should cerify the email correctly", () => {
		cy.intercept("GET", `http://localhost:5555/users/get-email`, {
			statusCode: 200,
			body: { email: "test@gmail.com" },
		}).as("getEmail");

		cy.visit("/account/other/accountVerification");

		cy.wait("@getEmail");
		cy.get('[data-id="av-msg"]').should("not.exist");
	});

	it("should handle error when get email fail", () => {
		cy.intercept("GET", `http://localhost:5555/users/get-email`, {
			statusCode: 404,
			body: {},
		}).as("getEmailFail");

		cy.visit("/account/other/accountVerification");

		cy.wait("@getEmailFail");
		cy.get('[data-id="av-msg"]').should(
			"contain",
			"Errore: email non trovata. Per favore, registrati di nuovo."
		);
	});

	it("should resend the verify email correctly", () => {
		cy.intercept("GET", `http://localhost:5555/users/get-email`, {
			statusCode: 200,
			body: { email: "test@gmail.com" },
		}).as("getEmail");

		cy.intercept("POST", `http://localhost:5555/users/resend-verification`, {
			statusCode: 200,
			body: { email: "test@gmail.com" },
		}).as("resendEmail");

		cy.visit("/account/other/accountVerification");
		cy.wait("@getEmail");

		cy.get('[data-id="av-resend"]').should("exist");
		cy.get('[data-id="av-resend"]').click();

		cy.wait("@resendEmail");
		cy.get('[data-id="av-msg"]').should(
			"contain",
			"Email di verifica reinviata con successo. Controlla la tua casella di posta."
		);
	});

	it("should show the correct message when the rensend-verify email fail", () => {
		cy.intercept("GET", `http://localhost:5555/users/get-email`, {
			statusCode: 200,
			body: { email: "test@gmail.com" },
		}).as("getEmail");

		cy.intercept("POST", `http://localhost:5555/users/resend-verification`, {
			statusCode: 500,
			body: { email: "test@gmail.com" },
		}).as("failResendEmail");

		cy.visit("/account/other/accountVerification");
		cy.wait("@getEmail");

		cy.get('[data-id="av-resend"]').should("exist");
		cy.get('[data-id="av-resend"]').click();

		cy.wait("@failResendEmail");
		cy.get('[data-id="av-msg"]').should(
			"contain",
			"Si è verificato un errore. Per favore, riprova più tardi."
		);
	});
});
