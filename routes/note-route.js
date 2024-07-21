const router = require("express").Router();
const noteCheck = require("../validation").noteCheck;
const Note = require("../models/note-model");

router.use("/", (req, res, next) => {
  console.log("note-route");
  next();
});

// create a note
router.post("/create", async (req, res) => {
  let { error } = noteCheck.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let { title, content } = req.body;
  let newNote = new Note({ title, content, userID: req.user._id });
  try {
    let saveNote = await newNote.save();
    return res.send({
      msg: "note is saved!",
      saveNote,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

// delete a note by note's ID
router.delete("/delete/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundNote = await Note.findOne({ _id });
    if (foundNote.userID.equals(req.user._id)) {
      await foundNote.deleteOne();
      return res.send({
        msg: "delete is complete!",
      });
    } else {
      return res.status(400).send("You're not the user of note!");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

// browse your note by user ID
router.get("/browse/:_id", async (req, res) => {
  console.log("browse your note by user ID");
  try {
    let { _id } = req.params;
    if (req.user._id.equals(_id)) {
      let foundNote = await Note.find({ userID: _id })
        .populate("userID", ["username", "email"])
        .exec();
      return res.send(foundNote);
    } else {
      return res.status(400).send("Wrong user");
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

// Get one note by note's ID. The note is use to edit-page
router.get("/edit/:_id", async (req, res) => {
  console.log("get-edit-route");
  let { _id } = req.params;
  try {
    let foundNote = await Note.findOne({ _id }).exec();
    return res.send(foundNote);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// patch a note
router.patch("/edit/:_id", async (req, res) => {
  console.log("patch-edit-route");
  let { error } = noteCheck.validate(req.body);
  if (error) return res.status(400).send(error);
  let { _id } = req.params;
  let { title, content } = req.body;
  try {
    let foundAndPatch = await Note.findOneAndUpdate(
      { _id },
      { title, content },
      { new: true }
    );
    return res.send(foundAndPatch);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
