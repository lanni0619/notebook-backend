const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const noteSchema = new Schema({
  id: { type: String },
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
  },
  // username type is set to primary key and connect to "User"
  // An ObjectId is a special type typically used for unique identifiers.
  // Set the model that this path refers to.
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
