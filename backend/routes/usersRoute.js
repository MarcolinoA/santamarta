import express from 'express';
import User from '../models/scheduleUsers.js';
import { resolveMx } from 'dns/promises'; // Usa il modulo `dns/promises` per `resolveMx`

const router = express.Router();

/* USERS ROUTES */

// Add a new user
router.post("/", async (req, res) => {
  try {
    const { name, surname, username, password, email, priority } = req.body;

    // Controllo del formato dell'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Il formato dell'email non è valido" });
    }

    // Controllo della lunghezza dell'email
    if (email.length > 254) {
      return res.status(400).send({ message: "L'email è troppo lunga" });
    }

    // Controllo della presenza del dominio
    const domain = email.split('@')[1];
    if (!domain) {
      return res.status(400).send({ message: "Il dominio dell'email non è valido" });
    }

    // Controllo della presenza di DNS MX
    try {
      const addresses = await resolveMx(domain);
      if (addresses.length === 0) {
        return res.status(400).send({ message: "Il dominio dell'email non è registrato" });
      }
    } catch (err) {
      return res.status(400).send({ message: 'Error checking MX records' });
    }

    // Controllo dell'unicità dell'email e dell'username
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send({ message: "L'email è già in uso" });
      } else if (existingUser.username === username) {
        return res.status(400).send({ message: "Lo username è già in uso" });
      }
    }

    // Controllo della password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: "La password deve essere lunga almeno 8 caratteri, deve contenere almeno una maiuscola, un carattere speciale e un numero"
      });
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
    console.log("Error creating user:", error.message);
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
