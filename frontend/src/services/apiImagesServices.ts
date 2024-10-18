const API_URL = process.env.NEXT_PUBLIC_API_URL;
const FALLBACK_IMAGE = "https://scuola-santamarta.s3.eu-north-1.amazonaws.com/logo.png"

export const imageServices = {
	// Get all images
	getAllImages: async () => {
		try {
			const response = await fetch(`${API_URL}/homeImage`);
			if (!response.ok) throw new Error("Failed to fetch images");
			return await response.json();
		} catch (error) {
			console.error("Error fetching images:", error);
			throw error;
		}
	},

	// Get a single image
	getImage: async (id: string) => {
		try {
			const response = await fetch(`${API_URL}/homeImage/${id}`);
			if (!response.ok) throw new Error("Failed to fetch image");
			return await response.json();
		} catch (error) {
			console.error("Error fetching image:", error);
			throw error;
		}
	},

	// Add a new image
	addImage: async (imageData: any) => {
		try {
			const response = await fetch(`${API_URL}/homeImage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(imageData),
			});
			if (!response.ok) throw new Error("Failed to add image");
			return await response.json();
		} catch (error) {
			console.error("Error adding image:", error);
			throw error;
		}
	},

	// Update an image
	updateImage: async (id: string, imageData: any) => {
		try {
			const response = await fetch(`${API_URL}/homeImage/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(imageData),
			});
			if (!response.ok) {
				const errorData = await response.json(); // Ottieni i dati di errore
				console.error("Error response:", errorData); // Log dei dati di errore
				throw new Error("Failed to update image");
			}
			return await response.json();
		} catch (error) {
			console.error("Error updating image:", error);
			throw error;
		}
	},

	// Delete an image
	deleteImage: async (id: string) => {
		try {
			const response = await fetch(`${API_URL}/homeImage/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) throw new Error("Failed to delete image");
			return await response.json();
		} catch (error) {
			console.error("Error deleting image:", error);
			throw error;
		}
	},

	getActiveImage: async () => {
    try {
        const response = await fetch(`https://santamarta-backend.onrender.com/homeImage/active`); // Assicurati che questo sia corretto
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching active image:", error);
        // Restituisci l'immagine di fallback in caso di errore
        return { image: FALLBACK_IMAGE }; // Utilizza l'URL dell'immagine di fallback
    }
},
};
