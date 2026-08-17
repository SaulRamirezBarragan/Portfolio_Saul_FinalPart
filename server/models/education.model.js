import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  education: { type: String, trim: true, required: "Education is required" },
  completion_date: { type: String, trim: true, required: "Completion date is required" },
  location: { type: String, trim: true, required: "Location is required" },
  gpa: { type: String, trim: true, default: "" },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
}, { timestamps: true });

export default mongoose.model("Education", EducationSchema);
