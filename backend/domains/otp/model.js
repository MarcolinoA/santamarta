import mongoose from "mongoose";
const Schema = mongoose.Schema;

const OTPSchema = new Schema({
	email: { type: String, unique: true },
	otp: String,
	createdAt: Date,
	expiresAt: Date,
});

const OTP = mongoose.model("OTP", OTPSchema);

// Usa `export default` per ES6
export default OTP;
