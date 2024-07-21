const passport = require("passport");
const passportGoogle = require("passport-google-oauth20");
const GoogleStrategy = passportGoogle.Strategy;
const User = require("../models/user-model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("===Googel Strategy zone===");
      try {
        let foundUser = await User.findOne({ googleID: profile.id });
        if (foundUser) {
          console.log("=== Have Found User ===");
          return done(null, foundUser);
        }
      } catch (error) {
        console.log(error);
      }

      try {
        console.log("=== Create A User Data ===");
        let newUser = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleID: profile.id,
          photo: profile.photos[0].value,
        }).save();
        done(null, newUser);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("=== serialize ===");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("=== deserialize ===");
  done(null, user);
});
