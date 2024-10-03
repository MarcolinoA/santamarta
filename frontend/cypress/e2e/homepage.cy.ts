describe("home page test", () => {
	it("should display the active home image", () => {
		cy.visit("/");
		cy.intercept("GET", "http://localhost:5555/homeImage/active", {
			statusCode: 200,
			body: {
				image:
					"https://scuola-santamarta.s3.eu-north-1.amazonaws.com/fattoriaDidattica.jpeg",
			},
		}).as("getActiveImage");

		cy.wait("@getActiveImage");
		cy.get('[data-id="home-page-img"]').should("be.visible");
	});

	it("should display the fallback img when there is an error", () => {
		cy.visit("/");
		cy.intercept("GET", "http://localhost:5555/homeImage/active", {
			statusCode: 500,
			body: {},
		}).as("getActiveImageError");

		cy.wait("@getActiveImageError");
		cy.get('[data-id="home-page-img"]')
			.should("be.visible")
			.invoke('attr', 'src')
			.should('include', 'logo.png');
	});
});

// VERIFICA IL FUNZIONAMENTO DI PRIORITY BTN
// VERIFICA CHE USERNAME VENGA PASSATO CORRETTAMENTE
// VERIFICA IL CAMBIAMENTO DOPO IL LOGIN
