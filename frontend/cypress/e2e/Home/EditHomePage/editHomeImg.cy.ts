describe("EditHomePage Component", () => {
	it("should render without crashing", () => {
		cy.visit("http://localhost:3000/home/homePageEdit");
		cy.get('[data-id="edit-home-img-title"]').should(
			"contain",
			"Fai click su una delle Card per impostarla come immagine della schermata home"
		);
	});

	it("should fetch and display images", () => {
		cy.intercept("GET", "http://localhost:5555/homeImage", {
			statusCode: 200,
			body: {
				data: [
					{
						_id: 1,
						title: "Test Image 1",
						image: "http://example.com/image1.jpg",
						desc: "Description 1",
					},
					{
						_id: 2,
						title: "Test Image 2",
						image: "http://example.com/image2.jpg",
						desc: "Description 2",
					},
				],
			},
		}).as("getImagesAll");

		cy.visit("http://localhost:3000/home/homePageEdit");

		cy.wait("@getImagesAll");

		cy.get('[data-id="card-wrapper"]').should("have.length", 2); // Assicurati che le immagini siano visualizzate
	});

	it("should update active image on card click", () => {
		cy.intercept("GET", "http://localhost:5555/homeImage", {
			statusCode: 200,
			body: {
				data: [
					{
						_id: 1,
						title: "Test Image 1",
						image: "http://example.com/image1.jpg",
						desc: "Description 1",
					},
					{
						_id: 2,
						title: "Test Image 2",
						image: "http://example.com/image2.jpg",
						desc: "Description 2",
					},
				],
			},
		}).as("getImagesAll");

		cy.intercept("POST", "http://localhost:5555/images/1", {
			statusCode: 200,
		}).as("updateImage");

		cy.visit("http://localhost:3000/home/homePageEdit");

		cy.wait("@getImagesAll");

		cy.get('[data-id="card-wrapper"]').first().click();
		cy.wait("@updateImage");

		// Assicurati di controllare che l'URL della pagina sia cambiato
		cy.url().should("include", "/");
	});
});
