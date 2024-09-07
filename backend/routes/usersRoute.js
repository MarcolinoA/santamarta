import express from 'express';
import User from '../models/scheduleUsers.js';
import { resolveMx } from 'dns/promises';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import sendEmail from '../util/sendEmail.js';

const router = express.Router();

const COOKIE_NAME = 'authToken';
const COOKIE_OPTIONS = {
  //httpOnly: true,
  secure: process.env.SECRET_KEY === 'production',
  maxAge: 24 * 60 * 60 * 1000,
};

const verifyEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 5, // Limite a 5 richieste per finestra
  message: 'Troppe richieste di verifica email, riprova più tardi.'
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 5, // Limite a 5 tentativi di login per finestra
  message: 'Troppi tentativi di login, riprova più tardi.'
});

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
    const verificationToken = crypto.randomBytes(48).toString('hex');

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

    const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email?token=${verificationToken}&email=${email}&type=registration`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verifica la tua email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://scuola-santamarta.s3.eu-north-1.amazonaws.com/logo.png" alt="Logo" style="width: 150px; height: auto;" />
          </div>
          <div style="text-align: center;">
            <h1 style="color: #333;">Benvenuto in Santa Marta!</h1>
            <p style="font-size: 16px; color: #555;">
              Grazie per esserti registrato! Per completare la tua registrazione, ti preghiamo di verificare il tuo indirizzo email cliccando sul pulsante qui sotto.
            </p>
            <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #000; background-color: #FDD040; border-radius: 5px; text-decoration: none;">
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

    // Imposta un cookie con l'email dell'utente
    res.cookie('userEmail', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // true in produzione
    maxAge: 15 * 60 * 1000, // 15 minuti
    sameSite: 'strict'
    });

    res.status(200).json({ message: 'Controlla la tua email per verificare il tuo indirizzo.' });
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    res.status(500).send({ message: "Errore durante la registrazione", error: error.message });
  }
});

router.get('/verify-email', verifyEmailLimiter, async (req, res) => {
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
      return res.redirect(`${process.env.FRONTEND_URL}/account/other/registrationSuccess`);
    } else if (type === 'reset-password') {
      return res.redirect(`${process.env.FRONTEND_URL}/account/password/recoverPassword`);
    } else {
      // Caso generico o per gestire errori
      return res.redirect(`${process.env.FRONTEND_URL}/verificationError`);
    }
  } catch (error) {
    console.error("Errore durante la verifica dell'email:", error);
    return res.status(500).send({ message: "Errore durante la verifica dell'email", error: error.message });
  }
});

// Route per re-inviare l'email di verifica
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;
  console.log('Richiesta di reinvio verifica per email:', email);

  try {
    const user = await User.findOne({ email, isVerified: false });
    console.log('Utente trovato:', user ? 'Sì' : 'No');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato o già verificato' });
    }

    // Genera un nuovo token di verifica
    const newVerificationToken = crypto.randomBytes(48).toString('hex');
    console.log('Nuovo token di verifica generato e salvato');

    // Invia nuovamente l'email di verifica
    const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email?token=${newVerificationToken}&email=${email}&type=registration`;
    console.log('URL di verifica:', verificationUrl);

   // Prepara le opzioni email
   const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verifica la tua email - Reinvio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://scuola-santamarta.s3.eu-north-1.amazonaws.com/logo.png" alt="Logo" style="width: 150px; height: auto;" />
        </div>
        <div style="text-align: center;">
          <h1 style="color: #333;">Benvenuto in Santa Marta!</h1>
          <p style="font-size: 16px; color: #555;">
            Grazie per esserti registrato! Per completare la tua registrazione, ti preghiamo di verificare il tuo indirizzo email cliccando sul pulsante qui sotto.
          </p>
          <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #000; background-color: #FDD040; border-radius: 5px; text-decoration: none;">
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

  console.log('Tentativo di invio email...');
  await sendEmail(mailOptions);
  console.log('Email inviata con successo');

    res.status(200).json({ message: 'Email di verifica reinviata con successo' });
  } catch (error) {
    console.error('Errore durante il reinvio dell\'email di verifica:', error);
    res.status(500).json({ message: 'Errore durante il reinvio dell\'email di verifica' });
  }
});

// leggi i cookies
router.get('/get-email', (req, res) => {
  const email = req.cookies.userEmail;
  if (email) {
    res.json({ email });
  } else {
    res.status(404).json({ message: 'Email non trovata' });
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

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.cookie('authToken', token, { ...COOKIE_OPTIONS, httpOnly: true });
      res.cookie('username', username, { ...COOKIE_OPTIONS, httpOnly: false });
      res.json({ message: 'Login successful', username: user.username });
    } else {
      res.status(401).send('Credenziali non valide' );
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

router.post('/logout', (req, res) => {
  try {
    res.clearCookie('authToken', { ...COOKIE_OPTIONS, httpOnly: true });
    res.clearCookie('username', { ...COOKIE_OPTIONS, httpOnly: false });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'An error occurred during logout' });
  }
});

router.post('/deleteAccount', async (req, res) => {
  try {
    const userId = req.user.id; // Ottenuto dal middleware di autenticazione

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.clearCookie('authToken', { ...COOKIE_OPTIONS, httpOnly: true });
    res.clearCookie('username', { ...COOKIE_OPTIONS, httpOnly: false });
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error during account deletion:', error);
    res.status(500).json({ message: 'An error occurred during account deletion' });
  }
});

/* Profilo utente
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
*/

export default router;
