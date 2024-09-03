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

router.post("/forgot-password", async (req, res) => {
	try {
			const { email } = req.body;
			const user = await User.findOne({ email });
			if (!user) {
					return res.status(404).json({ message: "User not found" });
			}

			const createdOTP = await sendOTP({
					email,
					subject: "Password Reset",
					message: "Use this OTP to reset your password",
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
					return res.status(400).json({ message: "Invalid or expired OTP" });
			}

			const user = await User.findOne({ email });
			if (!user) {
					return res.status(404).json({ message: "User not found" });
			}

			user.password = await hashData(newPassword);
			await user.save();

			await deleteOTP(email);

			res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
			res.status(400).send(error.message);
	}
});

export default router