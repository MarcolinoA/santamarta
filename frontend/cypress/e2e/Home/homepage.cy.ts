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
			.invoke("attr", "src")
			.should("include", "logo.png");
	});

	it("should display the fallback image if no active image is returned", () => {
		cy.visit("/");
		cy.intercept("GET", "http://localhost:5555/homeImage/active", {
			statusCode: 200,
			body: { image: null },
		}).as("getEmptyImage");

		cy.wait("@getEmptyImage");
		cy.get('[data-id="home-page-img"]')
			.should("be.visible")
			.invoke("attr", "src")
			.should("include", "logo.png");
	});
	it("should show loading spinner while fetching the image", () => {
		cy.visit("/");
		cy.intercept("GET", "http://localhost:5555/homeImage/active", (req) => {
			req.reply((res) => {
				if (res) { // Check if res is defined
					// Use setTimeout to delay the response
					setTimeout(() => {
						res.send({
							statusCode: 200,
							body: { image: "https://scuola-santamarta.s3.eu-north-1.amazonaws.com/fattoriaDidattica.jpeg" },
						});
					}, 1000);
				}
			});
		}).as("getActiveImage");

		// Verifica che il caricamento sia visibile prima che l'immagine venga visualizzata
		cy.get('[data-id="loading-spinner"]').should("be.visible");
		cy.wait("@getActiveImage");
		cy.get('[data-id="home-page-img"]').should("be.visible");
		cy.get('[data-id="loading-spinner"]').should("not.exist");
	});
});

// VERIFICA IL FUNZIONAMENTO DI PRIORITY BTN
// VERIFICA CHE USERNAME VENGA PASSATO CORRETTAMENTE
// VERIFICA IL CAMBIAMENTO DOPO IL LOGIN
