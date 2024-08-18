import mongoose from "mongoose";

const homeImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  }
});

const HomeImage = mongoose.model('HomeImage', homeImageSchema);

export default HomeImage;
