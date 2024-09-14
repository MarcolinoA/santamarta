import generateOTP from "../../util/generateOTP.js";
import OTP from "./model.js";
import { hashData, verifyHashedData } from "../../util/hashData.js";
import sendEmail from "../../util/sendEmail.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const verifyOTP = async ({ email, otp }) => {
	try {
		if(!email || !otp ) {
			throw Error("Provide values for email, otp");
		}

		// ensure otp record exists
		const matchedOTPRecord = await OTP.findOne({
			email,
		});

		if(!matchedOTPRecord){
			throw Error("No otp records found")
		}

		const { expiresAt } = matchedOTPRecord

		// checking for expired code
		if(expiresAt < Date.now()) {
			throw Error("Code has expired. Request for a new one")
		}
			
		const hashedOTP = matchedOTPRecord.otp;
		const validOTP = await verifyHashedData(otp, hashedOTP);
		return validOTP
	} catch (error) {
		throw error
	}
}

export const deleteOTP = async (email) => {
  try {
      await OTP.deleteOne({ email });
  } catch (error) {
      throw error;
  }
}

export const sendOTP = async ({ email, subject, message, duration = 1 }) => {
  // Ottieni il percorso della directory corrente (in moduli ES)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  try {
    if (!(email && subject && message)) {
      throw new Error("Inserisci un'email, un oggetto e un messaggio");
    }

    // Rimuove eventuali vecchi record per l'email specificata
    await OTP.deleteOne({ email });

    // Genera l'OTP
    const otp = generateOTP();

    // Leggi il file HTML e sostituisci eventuali placeholder
    let htmlContent = fs.readFileSync(path.join(__dirname, '../../util/emailTemplate.html'), 'utf8');
    htmlContent = htmlContent.replace('{{OTP}}', otp);  // Sostituisci il placeholder con l'OTP generato
    htmlContent = htmlContent.replace('{{MESSAGE}}', message);  // Sostituisci il placeholder con il messaggio

    // Configura l'email da inviare
    const mailOptions = {
      from: process.env.AUTH_MAIL,
      to: email,
      subject,
      html: htmlContent
    };

    // Invia l'email
    await sendEmail(mailOptions);

    // Salva l'OTP nel database
    const hashedOTP = await hashData(otp);
    const newOTP = new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * duration, // Scadenza OTP in base alla durata
    });

    const createdOTPRecord = await newOTP.save();
    return createdOTPRecord;
  } catch (error) {
    console.error("Errore durante l'invio dell'OTP:", error);
    throw error;
  }
};
