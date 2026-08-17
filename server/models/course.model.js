import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: "Course name is required", unique: true },
});

export default mongoose.model("Course", CourseSchema);
