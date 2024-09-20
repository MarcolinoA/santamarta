import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Crea un trasportatore di email
const transporter = nodemailer.createTransport({
  service:'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true
});

// Test del trasportatore
transporter.verify((error, success) => {
  if (error) {
    console.error('Errore di connessione al server SMTP:', error);
  } else {
    console.log('Trasportatore SMTP configurato correttamente');
  }
});

// Funzione per inviare email
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    throw error; // Propaga l'errore per ulteriori elaborazioni
  }
};

export default sendEmail;
