import express from "express";
import User from "../models/scheduleUsers.js";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).send({
			count: users.length,
			data: users,
		});
	} catch (error) {
		res
			.status(500)
			.send({ message: "Failed to fetch users", error: error.message });
	}
});

// Get a single user
router.get("/find/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Error retrieving user:", error.message);
		res
			.status(500)
			.send({ message: "Failed to retrieve user", error: error.message });
	}
});

// Update user data
router.put("/update/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, surname, username, password, email, priority } = req.body;

		// Validate input
		if (!name || !surname || !username || !password || !email) {
			return res.status(400).send({
				message:
					"All fields are required: name, surname, username, password, email",
			});
		}

		const result = await User.findByIdAndUpdate(id, req.body, { new: true });
		if (!result) {
			return res.status(404).json({ message: "User not found" });
		}
		return res
			.status(200)
			.send({ message: "User updated successfully", user: result });
	} catch (error) {
		res
			.status(500)
			.send({ message: "Failed to update user", error: error.message });
	}
});

// Route per eliminare un utente tramite ID
router.delete("/delete/:id", async (req, res) => {
	try {
		const userId = req.params.id;
		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).json({ message: "Utente non trovato" });
		}

		res.status(200).json({ message: "Utente eliminato con successo" });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Errore nel server", error: error.message });
	}
});

export default router;
