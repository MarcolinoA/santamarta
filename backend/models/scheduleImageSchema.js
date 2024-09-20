import mongoose from "mongoose";

const homeImageSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	active: {
		type: Boolean,
		required: false,
		default: false
	}
});

const HomeImage = mongoose.model("HomeImage", homeImageSchema);

export default HomeImage;
