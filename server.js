// Setup server
require("dotenv").config();
const express = require("express");
const app = express();
// Setup mongoDB
const mongoose = require("mongoose");
// Routes
const authRoute = require("./routes/auth-route");
const noteRoute = require("./routes/note-route");
// passport
const passport = require("passport");
require("./config/passport").jwt(passport);
const session = require("express-session");
// cors
const cors = require("cors");

// connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log("DB connection is complete"))
  .catch((e) => console.log(e));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

session;
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
// app.use(passport.session());

app.use("/auth", authRoute);
// The note route should be protected by JWT
app.use("/note", passport.authenticate("jwt", { session: false }), noteRoute);

app.listen(process.env.SERVER_PORT || 8080, () => {
  console.log("Backend server is running on " + process.env.SERVER_PORT);
});
