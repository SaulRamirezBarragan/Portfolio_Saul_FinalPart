import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "./../../config/config.js";
const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match." });
    }
    const role = user.role || "user";
    const token = jwt.sign(
      { _id: user._id, role },
      config.jwtSecret,
      { expiresIn: "2h" },
    );
    res.cookie("t", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: config.env === "production",
      maxAge: 2 * 60 * 60 * 1000,
    });
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};
const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "signed out",
  });
};
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "auth",
  getToken: (req) => {
    if (req.cookies?.t) return req.cookies.t;
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.slice(7);
    return undefined;
  },
});
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};
const requireRole = (role) => (req, res, next) => {
  if (req.auth?.role !== role) {
    return res.status(403).json({ error: "Administrator role required" });
  }
  next();
};
export default { signin, signout, requireSignin, hasAuthorization, requireRole };
