import express from 'express';
import User from '../models/scheduleUsers.js';
import { resolveMx } from 'dns/promises';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

const COOKIE_NAME = 'authToken';
const COOKIE_OPTIONS = {
  //httpOnly: true,
  secure: process.env.SECRET_KEY === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

/* USERS ROUTES */

// Add a new user
router.post('/register', async (req, res) => {
  const { name, surname, username, password, email } = req.body;

  try {
    // 1. Validazione Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ message: "Il formato dell'email non è valido" });
    }

    if (email.length > 254) {
      return res.status(400).send({ message: "L'email è troppo lunga" });
    }

    const domain = email.split('@')[1];
    if (!domain) {
      return res.status(400).send({ message: "Il dominio dell'email non è valido" });
    }

    const addresses = await resolveMx(domain);
    if (addresses.length === 0) {
      return res.status(400).send({ message: `Il dominio dell'email (${domain}) non ha record MX validi.` });
    }

    // 2. Verifica unicità username e email
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ message: "Email o username già in uso" });
    }

    // 3. Validazione della Password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: "La password deve essere lunga almeno 8 caratteri e contenere almeno una maiuscola, un carattere speciale e un numero"
      });
    }

    // 4. Crittografia della Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Generazione del Token di Verifica
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Non salvare l'utente qui

    // 7. Invia l'email di verifica
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email?token=${verificationToken}&name=${name}&surname=${surname}&username=${username}&password=${hashedPassword}&email=${email}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica la tua email',
      text: `Clicca sul link per verificare la tua email: ${verificationUrl}`,
      html: `<b>Clicca sul link per verificare la tua email:</b> <a href="${verificationUrl}">${verificationUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Controlla la tua email per verificare il tuo indirizzo.' });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).send({ message: "Errore durante la registrazione", error: error.message });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token, name, surname, username, password, email } = req.query;

  try {
    // Supponiamo che tu abbia salvato il token nel database quando l'utente si è registrato.
    const user = await User.findOne({ email, verificationToken: token });
    
    if (!user) {
      return res.status(400).json({ message: 'Token non valido o utente non trovato' });
    }

    // Verifica se l'utente è già verificato
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email già verificata' });
    }

    // Salva l'utente come verificato
    user.isVerified = true;
    user.verificationToken = null; // Elimina il token dopo l'uso
    await user.save();

    res.status(200).json({ message: 'Email verificata, registrazione completata.' });
  } catch (error) {
    console.error("Errore durante la verifica dell'email:", error);
    res.status(500).send({ message: "Errore durante la verifica dell'email", error: error.message });
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

// Route per eliminare un utente tramite ID
router.delete('/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
          return res.status(404).json({ message: 'Utente non trovato' });
      }

      res.status(200).json({ message: 'Utente eliminato con successo' });
  } catch (error) {
      res.status(500).json({ message: 'Errore nel server', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = 'some-generated-token'; // Genera un token JWT o simile
      res.cookie('authToken', token, COOKIE_OPTIONS);
      res.cookie('username', username, COOKIE_OPTIONS); // Salva lo username in un cookie
      res.json({ message: 'Login successful', username: user.username });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('authToken', COOKIE_OPTIONS);
    res.clearCookie('username', COOKIE_OPTIONS);
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'An error occurred during logout' });
  }
});

router.post('/deleteAccount', async (req, res) => {
  try {
    const { username } = req.cookies;

    if (!username) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findOneAndDelete({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.clearCookie('authToken', COOKIE_OPTIONS);
    res.clearCookie('username', COOKIE_OPTIONS);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error during account deletion:', error);
    res.status(500).json({ message: 'An error occurred during account deletion' });
  }
});

// Profilo utente
router.get('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send('You need to log in');
  }

  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send('An error occurred while fetching the profile');
  }
});

export default router;
