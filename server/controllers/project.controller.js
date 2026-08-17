import Project from "../models/project.model.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  try {
    const { title, completion_date, location, description, image } = req.body;
    const project = await Project.create({
      title,
      completion_date,
      location,
      description,
      image,
    });

    return res.status(201).json(project);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.json(projects);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const projectByID = async (req, res, next, id) => {
  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    req.profile = project;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve project",
    });
  }
};

const read = (req, res) => res.json(req.profile);

const update = async (req, res) => {
  try {
    const { title, completion_date, location, description, image } = req.body;

    Object.assign(req.profile, {
      title,
      completion_date,
      location,
      description,
      image,
    });

    await req.profile.save();
    return res.json(req.profile);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    await req.profile.deleteOne();
    return res.json({ message: "Project deleted" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Project.deleteMany({});
    return res.json({
      message: `${result.deletedCount} projects deleted`,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  projectByID,
  read,
  list,
  remove,
  update,
  removeAll,
};
