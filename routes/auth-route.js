const router = require("express").Router();
// MongoDB Model
const User = require("../models/user-model");
// Joi
const signupCheck = require("../validation").signupCheck;
const loginCheck = require("../validation").loginCheck;
// Auth
const jwt = require("jsonwebtoken");
// passport
const passport = require("passport");
require("../config/passport-google");

router.use("/", (req, res, next) => {
  console.log("auth-request");
  next();
});

// signup account
router.post("/signup", async (req, res) => {
  // check signup data
  let check = signupCheck.validate(req.body);
  if (check.error) return res.status(400).send(check.error.message);
  // check whether the email exist
  let { username, email, password } = req.body;
  let foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    let newUser = new User({ username, email, password });
    try {
      let result = await newUser.save();
      // show all user the DB have.
      let foundAllUser = await User.find();
      console.log(foundAllUser);
      return res.send({
        msg: "Signup is complete",
        result,
      });
    } catch (error) {
      res.status(500).send("error");
    }
  } else {
    return res.send("Fail to signup :( The user which you apply is exist.");
  }
});

// login account
router.post("/login", async (req, res) => {
  console.log("login-route");
  // check signup data
  let check = loginCheck.validate(req.body);
  if (check.error) return res.status(400).send(check.error.message);
  // check whether the email exist
  let { email, password } = req.body;
  let foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(400).send("incorrect email or password");

  foundUser.checkPassword(password, (error, result) => {
    // if bcrypt function have some problem
    if (error) return res.status(500).send(error);
    if (result) {
      // make jwt to user
      const payload = { _id: foundUser._id, email };
      console.log("make a token");
      const token = jwt.sign(payload, process.env.JWT_privateKey, {
        // expiresIn: "1h",
      });
      return res.send({
        msg: "successful login",
        token: "JWT " + token,
        username: foundUser.username,
        email: foundUser.email,
        _id: foundUser._id,
      });
    } else {
      return res.status(401).send("incorrect email or password");
    }
  });
});

// google Oauth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google redirect
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    const payload = {
      _id: req.user._id,
      email: req.user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_privateKey, {
      //  expiresIn: "1h",
    });
    res.cookie("jwt", token, { sameSite: false, secure: true });
    res.redirect(process.env.CLIENT_URL);
  }
);

// get google user data
router.get(
  "/google/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // passport will use token to User data and asign to req.user
    return res.send(req.user);
  }
);

module.exports = router;
