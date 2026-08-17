import Contact from "../models/contact.model.js";
import errorHandler from "./error.controller.js";

const create = async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;
    const contact = await Contact.create({
      firstname,
      lastname,
      email,
      message,
      status: false,
    });

    return res.status(201).json(contact);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const list = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .select("firstname lastname email message status")
      .sort({ _id: -1 });

    return res.json(contacts);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const contactByID = async (req, res, next, id) => {
  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    req.profile = contact;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve contact",
    });
  }
};

const read = (req, res) => res.json(req.profile);

const update = async (req, res) => {
  try {
    const { firstname, lastname, email, message, status } = req.body;

    Object.assign(req.profile, {
      firstname,
      lastname,
      email,
      message,
      status: Boolean(status),
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
    return res.json({ message: "Contact deleted" });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await Contact.deleteMany({});
    return res.json({
      message: `${result.deletedCount} contacts deleted`,
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  contactByID,
  read,
  list,
  remove,
  update,
  removeAll,
};
