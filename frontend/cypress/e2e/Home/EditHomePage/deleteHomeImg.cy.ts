describe("DeleteHomeImg Page", () => {
	it("should load and display images", () => {
		cy.intercept("GET", "http://localhost:5555/images", {
			statusCode: 200,
			body: [
					{
							_id: "1",
							title: "Test Image 1",
							image: "http://example.com/image1.jpg",
							desc: "Description 1",
							status: "active",
					},
					{
							_id: "2",
							title: "Test Image 2",
							image: "http://example.com/image2.jpg",
							desc: "Description 2",
							status: "active",
					},
			],
	}).as("getImages");

	cy.visit("http://localhost:3000/home/homePageDeleteImg");

	cy.wait("@getImages");

		cy.get('[data-id="delete-img-container"]').should("be.visible");
		cy.get('[data-id="delete-img-title"]').should(
			"contain",
			"Elimina un'immagine dal database"
		);
	});

	it("should display loading state while fetching images", () => {
		cy.intercept("GET", "http://localhost:5555/images", {
			delay: 2000, // Simulating a delay
			statusCode: 200,
			body: [],
		}).as("delayedImages");

		cy.visit("/home/deleteHomeImg");
		cy.wait("@delayedImages");

		// Assuming you have a loading indicator
		cy.get(".loadingIndicator").should("be.visible");
	});

	it("should delete an image and redirect", () => {
		cy.intercept("GET", "http://localhost:5555/images", {
			statusCode: 200,
			body: [
					{
							_id: "1",
							title: "Test Image 1",
							image: "http://example.com/image1.jpg",
							desc: "Description 1",
							status: "active",
					},
					{
							_id: "2",
							title: "Test Image 2",
							image: "http://example.com/image2.jpg",
							desc: "Description 2",
							status: "active",
					},
			],
	}).as("getImages");

		cy.intercept("DELETE", "localhost:5555/homeImage/", {
			statusCode: 200,
		}).as("deleteImage");

		cy.wait("@getImages");

		cy.get('[data-id="delete-btn-1"]').click();
		cy.wait("@deleteImage");

		cy.url().should("include", "/home/homePageEdit"); // verify redirection
	});

	it("should show error message on delete failure", () => {
		cy.intercept("DELETE", "http://localhost:5555/images/1", {
			statusCode: 500,
			body: { message: "Internal Server Error" },
		}).as("deleteImageError");

		cy.get('[data-id="delete-btn-1"]').click();
		cy.wait("@deleteImageError");

		cy.get(".errorMessage").should("contain", "Errore durante il salvataggio."); // check error message
	});
});
