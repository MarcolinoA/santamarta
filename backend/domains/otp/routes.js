import express from "express";
const router = express.Router()
import { verifyOTP, sendOTP, deleteOTP } from "./controller.js";
import { hashData } from "../../util/hashData.js"
import User from "../../models/scheduleUsers.js"

// Request new verification OTP
router.post("/", async (req, res) => {
	try {
		const { email, subject, message, duration } = req.body

		const createdOTP = await sendOTP({
			email, subject, message, duration
		})
		res.status(200).json(createdOTP)
	} catch (error) {
		res.status(400).send(error.message)
	}
})

router.post("/verify", async (req, res) => {
	try {
		let { email, otp } = req.body;
		
		const validOTP = await verifyOTP({ email, otp })
		res.status(200).json({ valid: validOTP })
	} catch (error) {
		res.status(400).send(error.message)
	}
})

router.post("/forgot-data", async (req, res) => {
	try {
		const { email, type } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
				return res.status(404).json({ message: "User not found" });
		}

    const createdOTP = await sendOTP({
      email,
      subject: `${type.charAt(0).toUpperCase() + type.slice(1)} Reset`,
      message: `Use this OTP to reset your ${type}`,
      duration: 1
    });
		res.status(200).json({ message: "OTP sent to your email" });
} catch (error) {
		res.status(400).send(error.message);
}
});

// Verify OTP and reset password
router.post("/reset-password", async (req, res) => {
	try {
			const { email, otp, newPassword } = req.body;
			
			const validOTP = await verifyOTP({ email, otp });
			if (!validOTP) {
					return res.status(400).json({ message: "OTP invalido o scaduto" });
			}

			const user = await User.findOne({ email });
			if (!user) {
					return res.status(404).json({ message: "Utente non trovato" });
			}

			// Password validation
			const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
			if (!passwordRegex.test(newPassword)) {
				return res.status(400).json({
					message: "La password deve essere lunga almeno 8 caratteri e deve contenere almeno una lettera maiuscola, un carattere speciale, e un numero"
				});
			}

			user.password = await hashData(newPassword);
			await user.save();

			await deleteOTP(email);

			res.status(200).json({ message: "Password reimpostata con successo" });
	} catch (error) {
			res.status(400).send(error.message);
	}
});

// Verify OTP and reset username
router.post("/reset-username", async (req, res) => {
	try {
			const { email, otp, newUsername } = req.body;
			
			const validOTP = await verifyOTP({ email, otp });
			if (!validOTP) {
					return res.status(400).json({ message: "OTP invalido o scaduto" });
			}

			const user = await User.findOne({ email });
			if (!user) {
					return res.status(404).json({ message: "Utente non trovato" });
			}

			// Username validation
			const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
			if (!usernameRegex.test(newUsername)) {
				return res.status(400).json({ message: "Lo username deve essere lungo tra i 3 e i 30 caratteri e può contenere solo lettere, numeri e underscores" });
			}
			
			// Check if the new username is already in use
			const existingUser = await User.findOne({ username: newUsername });
			if (existingUser && existingUser.email !== email) {
				return res.status(400).json({ message: "Questo username è già in uso" });
			}
			
			user.username = await newUsername;
			await user.save();

			await deleteOTP(email);

			res.status(200).json({ message: "Username reimpostato con successo" });
	} catch (error) {
			res.status(400).send(error.message);
	}
});

export default router