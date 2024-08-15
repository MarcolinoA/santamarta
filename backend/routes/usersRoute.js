import User from "../models/scheduleUsers.js"
import express from 'express'

const router = express.Router();

/* USERS ROUTES */

// Add a new user
router.post("/", async (req, res) => {
  try {
    const { name, surname, username, password, email } = req.body;

    const newUser = new User({
      name,
      surname,
			username,
			password,
			email
    });

    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Get a single user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error while retrieving image details:', error);
    res.status(500).send({ message: 'Error while retrieving user details' });
  }
});

// Update image data
router.put("/:id", async (request, response) => {
  try {
    if (
      !request.body.name ||
      !request.body.surname ||
			!request.body.username ||
			!request.body.password ||
			!request.body.email 
    ) {
      return response.status(400).send({
        message: "Send all required fields: name, surname, username, password, email",
      });
    }
    const { id } = request.params;
    const result = await User.findByIdAndUpdate(id, request.body);
    if (!result) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete a user
router.delete("/:id/", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "User not found" });
    }

    return response.status(201).json({ message: "User deleted successfully" });
  } catch (error) {}
});

export default router;