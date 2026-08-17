import mongoose from "mongoose";
import Education from "../models/education.model.js";
import Course from "../models/course.model.js";
import errorHandler from "./error.controller.js";

async function courseIds(input = []) {
  const values = Array.isArray(input) ? input : String(input).split(",");

  return Promise.all(
    values
      .map((value) => String(value).trim())
      .filter(Boolean)
      .map(async (value) => {
        if (mongoose.isValidObjectId(value)) return value;

        const course = await Course.findOneAndUpdate(
          { name: value },
          { $setOnInsert: { name: value } },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          },
        );

        return course._id;
      }),
  );
}

const create = async (req, res) => {
  try {
    const { education, completion_date, location, gpa, courses } = req.body;
    const record = await Education.create({
      education,
      completion_date,
      location,
      gpa,
      courses: await courseIds(courses),
    });

    return res.status(201).json(await record.populate("courses"));
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const educations = await Education.find()
      .populate("courses", "name")
      .sort({ createdAt: -1 });

    return res.json(educations);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const educationByID = async (req, res, next, id) => {
  try {
    const education = await Education.findById(id).populate("courses", "name");

    if (!education) {
      return res.status(404).json({ error: "Education not found" });
    }

    req.profile = education;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve education",
    });
  }
};

const read = (req, res) => res.json(req.profile);

const update = async (req, res) => {
  try {
    const { education, completion_date, location, gpa, courses } = req.body;

    Object.assign(req.profile, {
      education,
      completion_date,
      location,
      gpa,
      courses: await courseIds(courses),
    });

    await req.profile.save();
    return res.json(await req.profile.populate("courses"));
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    await req.profile.deleteOne();
    return res.json({ message: "Education deleted" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Education.deleteMany({});
    return res.json({
      message: `${result.deletedCount} educations deleted`,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  educationByID,
  read,
  list,
  remove,
  update,
  removeAll,
};
