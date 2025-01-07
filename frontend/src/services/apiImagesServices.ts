const FALLBACK_IMAGE =
  "https://scuola-santamarta.s3.eu-north-1.amazonaws.com/logo.png";

export const imageServices = {
  // Get all images
  getAllImages: async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/homeImage`
      );
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/homeImage/${id}`
      );
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/homeImage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imageData),
        }
      );
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/homeImage/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imageData),
        }
      );
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/homeImage/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete image");
      return await response.json();
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },

  getActiveImages: async () => {
	try {
	  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/homeImage/active`);
	  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
	  // Supponiamo che la risposta sia un array di oggetti, ognuno con una proprietà "image"
	  const images = await response.json();
  
	  // Se l'array di immagini è vuoto, restituisci un array con un'immagine di fallback
	  if (!images || images.length === 0) {
		return [{ image: FALLBACK_IMAGE }];
	  }
  
	  // Se l'array non è vuoto, restituisci tutte le immagini
	  return images.map((img: any) => ({ image: img.image })); // Mappa l'array per avere la struttura giusta
	} catch (error) {
	  console.error("Error fetching active images:", error);
	  // In caso di errore, restituisci un array con l'immagine di fallback
	  return [{ image: FALLBACK_IMAGE }];
	}
  }
};
