import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  firstname: {
    type: String,
    trim: true,
    required: "Firstname is required",
  },
  lastname: {
    type: String,
    trim: true,
    required: "Lastname is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  message: {
    type: String,
    trim: true,
    required: "Message is required",
  },
  status: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Contact", ContactSchema);
