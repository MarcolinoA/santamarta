import HomeImage from "../models/scheduleImageSchema.js";
import express from "express";

const router = express.Router();

/* HOME IMAGE ROUTES */

// Add a new image
router.post("/", async (req, res) => {
	try {
	  const { title, image, active } = req.body;
  
	  // Crea una nuova immagine senza modificare lo stato delle altre
	  const newHomeImage = new HomeImage({
		title,
		image,
		active: active || false, // default a false se non specificato
	  });
	  
	  const savedHomeImage = await newHomeImage.save();
	  res.status(201).json(savedHomeImage);
	} catch (error) {
	  res.status(500).send({ message: error.message });
	}
  });

// Get all images
router.get("/", async (req, res) => {
	try {
		const images = await HomeImage.find({});
		res.status(200).send({
			count: images.length,
			data: images,
		});
	} catch (error) {
		error.message;
		res.status(500).send({ message: error.message });
	}
});

// Update image data
router.put("/:id", async (request, response) => {
	try {
		const { id } = request.params;
		const { active } = request.body;

		// Aggiorna l'immagine con i nuovi dati
		const result = await HomeImage.findByIdAndUpdate(
			id, 
			{ active }, 
			{ new: true }
		);

		if (!result) {
			return response.status(404).json({ message: "Image not found" });
		}

		return response.status(200).send({ 
			message: "Image updated successfully",
			data: result 
		});
	} catch (error) {
		console.error("Error updating image:", error);
		response.status(500).send({ message: error.message });
	}
});

// Delete a image
router.delete("/:id/", async (request, response) => {
	try {
		const { id } = request.params;
		const result = await HomeImage.findByIdAndDelete(id);
		if (!result) {
			return response.status(404).json({ message: "Image not found" });
		}

		return response.status(201).json({ message: "Image deleted successfully" });
	} catch (error) {}
});

// Get the active images
router.get("/active", async (req, res) => {
	try {
		// Log per debug
		console.log("Cercando immagini attive...");
		
		// Trova tutte le immagini che sono attive
		const activeImages = await HomeImage.find({ active: true });
		
		// Log del risultato
		console.log("Immagini attive trovate:", activeImages);
		console.log("Numero di immagini attive:", activeImages.length);
		
		// Log della query
		const query = HomeImage.find({ active: true }).getFilter();
		console.log("Query utilizzata:", JSON.stringify(query));

		// Formatta la risposta nel modo atteso dal frontend
		const response = {
			images: activeImages.map(img => ({
				image: img.image,
				title: img.title,
				_id: img._id,
				active: img.active // aggiungiamo questo per debug
			}))
		};

		console.log("Risposta finale:", JSON.stringify(response));

		return res.status(200).json(response);

	} catch (error) {
		console.error("Error fetching active images:", error);
		return res.status(500).json({ 
			message: "Error fetching active images", 
			error: error.message,
			images: []
		});
	}
});

// Aggiungi temporaneamente questa route per debug
router.get("/debug", async (req, res) => {
	try {
		const allImages = await HomeImage.find({});
		return res.status(200).json({
			total: allImages.length,
			images: allImages.map(img => ({
				id: img._id,
				title: img.title,
				active: img.active
			}))
		});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
});

export default router;
