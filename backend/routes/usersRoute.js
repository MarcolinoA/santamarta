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

    // 2. Validazione Name
    const nameRegex = /^[a-zA-ZàèìòùÀÈÌÒÙäöüÄÖÜß\s-]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).send({ message: "Il nome deve essere lungo tra 2 e 50 caratteri e può contenere solo lettere, spazi, trattini e caratteri accentati" });
    }
    
    // 3. Validazione Surname
    const surnameRegex = /^[a-zA-ZàèìòùÀÈÌÒÙäöüÄÖÜß\s-]{2,50}$/;
    if (!surnameRegex.test(surname)) {
      return res.status(400).send({ message: "Il cognome deve essere lungo tra 2 e 50 caratteri e può contenere solo lettere, spazi, trattini e caratteri accentati" });
    }
    
    // 4. Validazione Username
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).send({ message: "Lo username deve essere lungo tra 3 e 30 caratteri e può contenere solo lettere, numeri e underscore" });
    }

    // 5. Verifica unicità username e email
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send({ message: "Email o username già in uso" });
    }

    // 6. Validazione della Password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message: "La password deve essere lunga almeno 8 caratteri e contenere almeno una maiuscola, un carattere speciale e un numero"
      });
    }

    // 7. Crittografia della Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 8. Generazione del Token di Verifica
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 9. Salva l'utente nel database con il token di verifica
    const newUser = new User({
      name,
      surname,
      username,
      password: hashedPassword,
      email,
      verificationToken,
      isVerified: false,
    });
    
    await newUser.save();

    // 10. Invia l'email di verifica
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

    const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email?token=${verificationToken}&name=${name}&surname=${surname}&username=${username}&password=${hashedPassword}&email=${email}&type=registration`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica la tua email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://scuola-santamarta.s3.eu-north-1.amazonaws.com/logo.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBkaCmV1LW5vcnRoLTEiSDBGAiEAqrH62Hk1V7et598%2BV37oF1S%2F8IXLbKvCly6Ddlp0IhACIQDlgR65h%2FpdkqiubId57qu07qI6Dl%2Fo7KQWlusm2%2Fu1DiqVAggyEAAaDDcyNDc3MjA3NTIwOCIM6XTOTZ7eOEBd%2Far6KvIBd9OVa4hshvrezUxrcucA4EHPk4087B0FvmbSsou1vf8M0tTQBMYl95I26LaKV0zmB7brL4cxr%2B7L%2FDe1TgqzK3BHSXOcFj4D2hEvbwhDT%2B9%2FoqD49Q%2BbEoYNZdfX0wP8e4OXPTiESr45Iw85M6WeTicQ21Mo0A2rmL1W0NLcx7y4t%2BZgJKAQMAFbeNQeX%2Bj%2Bs6oLtGw%2BKwIsVZfoSqMBbw22X%2BRIXGQQ3Avu2Pydo6DlYS4wSueQHsbAqC5r0Vx83RfUa4JF0yzdGGV658kb%2FBq8Ebc7kTwEBA4RDrzw7mlHtx%2FfV4BgUARD4XVuIUEVe5Qw%2B6y9tgY63gHiO44NVJDT82FiMYmemiBXxp%2FcoMCAv8aILnXjC6xrqx%2BccFuhXlCb4ot4VEEq029tmi15aLo8UAU04rx3UkpT%2FozskRdERmig20NxxxiyauzQ0CzZUYdBFwnm8kmyZ1IxI4diE3L1W05aSWlOV0%2BAUxaMw%2BjZikf1j1kMCn8gRQA%2BgpZSHQKeMXUjC4SH%2BUfQdBtzfx0YJLpjbG59mscrVcAqxn9akbC8193JTkbittCvxTIx%2BuAKIZrcK6ac56LJitdkX6tvmwT8lA0CNuPZK%2Fqba5CILzHGaEZEXq4%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240828T172046Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2RP6IG3EBN6UTZIV%2F20240828%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Signature=02d81653192c256ff4bd3dd63bf5126e23eeec2e5416d71f13c6ff823f12f7af" alt="Logo" style="width: 150px; height: auto;" />
          </div>
          <div style="text-align: center;">
            <h1 style="color: #333;">Benvenuto in Santa Marta!</h1>
            <p style="font-size: 16px; color: #555;">
              Grazie per esserti registrato! Per completare la tua registrazione, ti preghiamo di verificare il tuo indirizzo email cliccando sul pulsante qui sotto.
            </p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">
              Verifica la tua email
            </a>
            <p style="font-size: 14px; color: #777;">
              Se il pulsante non funziona, copia e incolla il seguente link nel tuo browser:
            </p>
            <a href="${verificationUrl}" style="font-size: 14px; color: #007bff;">${verificationUrl}</a>
          </div>
          <div style="margin-top: 40px; text-align: center; color: #999; font-size: 12px;">
            <p>
              Se non hai richiesto questa email, puoi ignorarla.
            </p>
            <p>
              © ${new Date().getFullYear()} Nome della tua azienda. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Controlla la tua email per verificare il tuo indirizzo.' });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).send({ message: "Errore durante la registrazione", error: error.message });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token, email, type } = req.query;

  try {
    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: 'Token non valido o utente non trovato' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email già verificata' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Reindirizzamenti diversi a seconda del tipo di verifica
    if (type === 'registration') {
      return res.redirect(`${process.env.FRONTEND_URL}/account/registrationSuccess`);
    } else if (type === 'reset-password') {
      return res.redirect(`${process.env.FRONTEND_URL}/account/forgotPasswords`);
    } else {
      // Caso generico o per gestire errori
      return res.redirect(`${process.env.FRONTEND_URL}/verificationError`);
    }
  } catch (error) {
    console.error("Errore durante la verifica dell'email:", error);
    return res.status(500).send({ message: "Errore durante la verifica dell'email", error: error.message });
  }
});

/* INIZIO ROUTES PER MODIFICARE LA PASSWORD /

// Route per richiedere il reset della password
router.post('/richiedi-reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const utente = await User.findOne({ email });

    if (!utente) {
      return res.status(404).json({ messaggio: "Nessun utente associato a questa email" });
    }
    if (!utente.isVerified) {
      return res.status(400).json({ messaggio: "L'email non è stata ancora verificata. Controlla la tua casella di posta" });
    }

    // Generazione del token di verifica
    const tokenVerifica = crypto.randomBytes(32).toString('hex');

    // Salva il token e la scadenza nel documento dell'utente
    utente.tokenResetPassword = tokenVerifica;
    utente.scadenzaResetPassword = Date.now() + 3600000; // 1 ora di validità
    await utente.save();

    // Invia l'email di verifica
    const urlVerifica = `${process.env.FRONTEND_URL}/account/reimposta-password?token=${tokenVerifica}&email=${email}`;

    const opzioniEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reimposta la tua password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="text-align: center;">Reimposta la tua password</h1>
          <p>Clicca sul link sottostante per reimpostare la tua password:</p>
          <a href="${urlVerifica}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Reimposta Password</a>
          <p>Se non hai richiesto questa email, ignora questo messaggio.</p>
        </div>
      `,
    };

    await sendEmail(opzioniEmail);

    res.status(200).json({ messaggio: 'Email inviata con successo. Controlla la tua casella di posta.' });

  } catch (errore) {
    console.error("Errore durante l'invio dell'email di reimpostazione password:", errore);
    res.status(500).json({ messaggio: "Errore durante la richiesta di nuova password" });
  }
});

// Route per reimpostare la password
router.post('/reimposta-password', async (req, res) => {
  const { token, email, nuovaPassword } = req.body;

  try {
    const utente = await User.findOne({
      email,
      tokenResetPassword: token,
      scadenzaResetPassword: { $gt: Date.now() },
    });

    if (!utente) {
      return res.status(400).json({ messaggio: 'Token non valido o scaduto' });
    }

    const passwordCriptata = await hashData(nuovaPassword);
    utente.password = passwordCriptata;
    utente.tokenResetPassword = null;
    utente.scadenzaResetPassword = null;
    await utente.save();

    res.status(200).json({ messaggio: 'Password reimpostata con successo!' });

  } catch (errore) {
    console.error("Errore durante la reimpostazione della password:", errore);
    res.status(500).json({ message: "Errore durante la reimpostazione della password" });
  }
});
/ FINE ROUTES PER MODIFICARE LA PASSWORD */

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
    res.status(500).send({ message: "Failed to retrieve user", error: error.message });
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
router.delete('/delete/:id', async (req, res) => {
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
