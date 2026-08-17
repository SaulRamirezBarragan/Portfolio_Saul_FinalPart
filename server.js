import config from "./config/config.js";
import app from "./server/express.js";
import mongoose from "mongoose";
import User from "./server/models/user.model.js";
mongoose.Promise = global.Promise;
mongoose
  .connect(config.mongoUri, {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useUnifiedTopology: true
  })
  .then(() => {
    console.log("Welcome to my Portfolio application");
    ensureAdminUser();
  });

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@portfolio.local";
  const password = process.env.ADMIN_PASSWORD || "Admin123!";
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    return;
  }
  await new User({
    name: "Portfolio Administrator",
    email,
    password,
    role: "admin",
  }).save();
  console.log(`Admin account ready: ${email}`);
}
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`);
});
app.get("/", (req, res) => {
  res.json({ message: "Welcome to User application." });
});
app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
  }
  console.info("Server started on port %s.", config.port);
});
