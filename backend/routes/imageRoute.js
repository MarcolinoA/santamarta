import HomeImage from "../models/scheduleImageSchema.js";
import express from "express";

const router = express.Router();

/* HOME IMAGE ROUTES */

// Add a new image
router.post("/", async (req, res) => {
	try {
		const { title, image, active } = req.body;

		const newHomeImage = new HomeImage({
			title,
			image,
			active,
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

// Get a single image 
/*
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const image = await HomeImage.findById(id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		res.status(200).json(image);
	} catch (error) {
		console.error("Error while retrieving image details:", error);
		res
			.status(500)
			.send({ message: "Error while retrieving IMG details" });
	}
});
*/

// Update image data
router.put("/:id", async (request, response) => {
	try {
		const { id } = request.params;

		// Trova l'immagine attiva attuale
		const currentActiveImage = await HomeImage.findOne({ active: true });

		// Se c'è un'immagine attiva, disattivala
		if (currentActiveImage) {
			await HomeImage.findByIdAndUpdate(currentActiveImage._id, { active: false });
		}

		// Attiva l'immagine selezionata
		const result = await HomeImage.findByIdAndUpdate(id, { active: true }, { new: true });
		if (!result) {
			return response.status(404).json({ message: "Image not found" });
		}
		return response.status(200).send({ message: "Image updated successfully" });
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

// Get the active image
router.get("/active", async (req, res) => {
	try {
		const activeImage = await HomeImage.findOne({ active: true });
		if (!activeImage) {
			return res.status(404).json({ message: "No active image found" });
		}
		res.status(200).json(activeImage);
	} catch (error) {
		console.error("Error fetching active image:", error); // Log the error details
		res.status(500).send({ message: "Error fetching active image", error: error.message }); // Include error message
	}
});

export default router;
