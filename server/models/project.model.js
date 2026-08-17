import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: "Title is required",
  },
  completion_date: {
    type: String,
    trim: true,
    required: "Completion date is required",
  },
  location: {
    type: String,
    trim: true,
    required: "Location is required",
  },
  description: {
    type: String,
    trim: true,
    required: "Description is required",
  },
  image: {
    type: String,
    required: "Image is required",
  },
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
