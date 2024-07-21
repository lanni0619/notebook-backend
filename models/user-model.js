const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  googleID: {
    type: String,
  },
  photo: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if ((!this.googleID && this.isNew) || this.isModified("password")) {
    let hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

// Schema instance methods
userSchema.methods.checkPassword = async function (password, cb) {
  let result = false;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (error) {
    return cb(error, result);
  }
};

module.exports = mongoose.model("User", userSchema);
