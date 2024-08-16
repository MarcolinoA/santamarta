import User from "../models/scheduleUsers.js";
import express from 'express';

const router = express.Router();

/* USERS ROUTES */

// Add a new user
router.post("/", async (req, res) => {
  try {
    const { name, surname, username, password, email, priority } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send({ message: 'Email already in use' });
      } else if (existingUser.username === username) {
        return res.status(400).send({ message: 'Username already in use' });
      }
    }

    const newUser = new User({
      name,
      surname,
      username,
      password,
      email,
      priority
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
    console.log("Error fetching users:", error.message);
    res.status(500).send({ message: "Failed to fetch users", error: error.message });
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
    console.error("Error retrieving user:", error.message);
    res.status(500).send({ message: "Failed to retrieve user", error: error.message });
  }
});

// Update user data
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, surname, username, password, email, priority } = req.body;

    // Validate input
    if (!name || !surname || !username || !password || !email) {
      return res.status(400).send({
        message: "All fields are required: name, surname, username, password, email",
      });
    }

    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send({ message: "User updated successfully", user: result });
  } catch (error) {
    console.log("Error updating user:", error.message);
    res.status(500).send({ message: "Failed to update user", error: error.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user:", error.message);
    res.status(500).send({ message: "Failed to delete user", error: error.message });
  }
});

export default router;
