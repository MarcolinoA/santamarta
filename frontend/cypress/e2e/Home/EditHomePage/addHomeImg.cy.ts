describe("AddHomeImg Page", () => {
	it("should update form state on input change", () => {
		cy.visit("/home/homePageAddImg");

		cy.get('[data-id="title-input"]')
			.type("Test Title")
			.should("have.value", "Test Title");
		cy.get('[data-id="image-input"]')
			.type("http://example.com/image.jpg")
			.should("have.value", "http://example.com/image.jpg");
	});

	it("should submit form with valid data and redirect", () => {
		cy.intercept("POST", "http://localhost:5555/homeImage", {
			statusCode: 200,
			body: {
				title: "test image",
				image: "http://example.com/image.jpg",
			},
		}).as("addImage");

		cy.visit("/home/homePageAddImg");

		cy.get('[data-id="title-input"]').type("test image");
		cy.get('[data-id="image-input"]').type("http://example.com/image.jpg");
		cy.get("form").submit();

		cy.wait("@addImage");
		cy.url().should("include", "/home/homePageEdit");
	});

	it("should display error message on failed submission", () => {
		cy.intercept("POST", "http://localhost:5555/homeImage", {
			statusCode: 500,
			body: {
				message: "Internal Server Error",
			},
		}).as("addImageError");

		cy.visit("/home/homePageAddImg");

		cy.get('[data-id="title-input"]').type("test image");
		cy.get('[data-id="image-input"]').type("http://example.com/image.jpg");
		cy.get("form").submit();

		cy.wait("@addImageError");

		cy.get('[data-id="error-message"]').should(
			"contain",
			"Errore durante il salvataggio."
		);
	});
});
