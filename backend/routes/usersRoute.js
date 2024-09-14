import express from 'express';
import User from '../models/scheduleUsers.js';
import { resolveMx } from 'dns/promises';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import sendEmail from '../util/sendEmail.js';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in the environment variables');
  process.exit(1);
}

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

// Add a new user
router.post('/register', async (req, res) => {
  const { name, surname, username, password, email } = req.body;

  try {
    // 1. Validazione Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Il formato dell'email non è valido");
    }

    if (email.length > 254) {
      return res.status(400).send("L'email è troppo lunga");
    }

    const domain = email.split('@')[1];
    if (!domain) {
      return res.status(400).send("Il dominio dell'email non è valido");
    }

    const addresses = await resolveMx(domain);
    if (addresses.length === 0) {
      return res.status(400).send(`Il dominio dell'email (${domain}) non ha record MX validi.`);
    }

    // 2. Validazione Name
    const nameRegex = /^[a-zA-ZàèìòùÀÈÌÒÙäöüÄÖÜß\s-]{2,50}$/;
    if (!nameRegex.test(name)) {
      return res.status(400).send("Il nome deve essere lungo tra 2 e 50 caratteri e può contenere solo lettere, spazi, trattini e caratteri accentati");
    }
    
    // 3. Validazione Surname
    const surnameRegex = /^[a-zA-ZàèìòùÀÈÌÒÙäöüÄÖÜß\s-]{2,50}$/;
    if (!surnameRegex.test(surname)) {
      return res.status(400).send("Il cognome deve essere lungo tra 2 e 50 caratteri e può contenere solo lettere, spazi, trattini e caratteri accentati" );
    }
    
    // 4. Validazione Username
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).send("Lo username deve essere lungo tra 3 e 30 caratteri e può contenere solo lettere, numeri e underscore");
    }

    // 5. Verifica unicità username e email
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send("Email o username già in uso");
    }

    // 6. Validazione della Password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).send("La password deve essere lunga almeno 8 caratteri e contenere almeno una maiuscola, un carattere speciale e un numero");
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
    const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email?token=${verificationToken}&email=${email}&type=registration`;

    await sendEmail({
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
    });

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
    return res.status(500).send({ message: "Errore durante la verifica dell'email", error: error.message });
  }
});

// Route per re-inviare l'email di verifica
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato o già verificato' });
    }

    // Genera un nuovo token di verifica
    const newVerificationToken = crypto.randomBytes(48).toString('hex');

    user.verificationToken = newVerificationToken;
    await user.save();

    // Invia nuovamente l'email di verifica
    const verificationUrl = `${process.env.BACKEND_URL}/users/verify-email?token=${newVerificationToken}&email=${email}&type=registration`;

   // Prepara le opzioni email
   await sendEmail({
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
  });

  res.status(200).json({ message: 'Email di verifica reinviata con successo' });
  } catch (error) {
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

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.cookie('authToken', token, {
        httpOnly: false, // Manteniamo false per il debug
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 ore
      });
    
      res.cookie('username', user.username, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000 // 24 ore
      });
      
      res.json({ message: 'Login successful', username: user.username });
    } else {
      res.status(401).json({ message: 'Credenziali non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred during login', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('authToken', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  res.clearCookie('username', { 
    httpOnly: false, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  res.json({ message: 'Logout successful' });
});

router.post('/deleteAccount', authMiddleware, async (req, res) => {
  try {
    const username = req.user.username;
    
    if (!username) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    
    const deletedUser = await User.findOneAndDelete({ username });

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.clearCookie('authToken', { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.clearCookie('username', { 
      httpOnly: false, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.json({ message: 'Account eliminato con successo' });
  } catch (error) {
    console.error('Error during account deletion:', error);
    res.status(500).json({ message: 'An error occurred during account deletion' });
  }
});

router.get('/verify-token', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

export default router;
