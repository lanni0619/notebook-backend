// JWT
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user-model");

// JWT Strategy
// return a function, it's parameter is passport
module.exports.jwt = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.JWT_privateKey;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log("passport - jwt - zone");
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          // done(null,foundUser) => req.user = foundUser
          return done(null, foundUser);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );
};
