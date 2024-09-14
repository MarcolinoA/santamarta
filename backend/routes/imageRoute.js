import HomeImage from "../models/scheduleImageSchema.js";
import express from 'express'

const router = express.Router();

/* HOME IMAGE ROUTES */

// Add a new image
router.post("/", async (req, res) => {
  try {
    const { title, image } = req.body;

    const newHomeImage = new HomeImage({
      title,
      image,
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
    (error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get a single image
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await HomeImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json(image);
  } catch (error) {
    console.error('Error while retrieving image details:', error);
    res.status(500).send({ message: 'Error while retrieving imagenmiì details' });
  }
});

// Update image data
router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.image
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, image",
      });
    }
    const { id } = request.params;
    const result = await HomeImage.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "Image not found" });
    }
    return response.status(200).send({ message: "Image updated successfully" });
  } catch (error) {
    (error.message);
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

export default router;