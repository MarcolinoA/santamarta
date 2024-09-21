import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	surname: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: {
		type: String,
	},
	priority: {
		type: Boolean,
		default: false,
	},
});

const User = mongoose.model("User", userSchema);

export default User;
