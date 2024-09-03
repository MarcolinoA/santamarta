import nodemailer from 'nodemailer';

// Crea un trasportatore di email
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // Imposta su true se utilizzi la porta 465
	auth: {
    user: "codingmarco@hotmail.com", 
		pass: "hpnrayfoklmlpvli"
  },
  logger: true,  // Abilita il logging
  debug: true    // Abilita il debug
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
    console.log('Email inviata:', info.response);
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    throw error; // Propaga l'errore per ulteriori elaborazioni
  }
};

export default sendEmail;
