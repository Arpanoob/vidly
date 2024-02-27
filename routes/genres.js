const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/async");
const admin = require("../middleware/admin");
const { validateGenre, genres } = require("../models/genre");
const validateObjectId = require("../middleware/validateObjectId");

// router.get(
//   "/",
// instead of this we use express async errors to cover normal Rest
//   asyncMiddleware(async (req, res) => {
//     const result = await genres.find();
//     res.send(result);
//   })
// );

router.get("/", async (req, res) => {
  const result = await genres.find();
  res.send(result);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genree = {
    name: req.body.name,
  };
  const genre = new genres(genree);
  await genre.save();
  res.send(genre);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await genres.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { name: req.body.name } },
    { new: true } // Return the updated document
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const genre = await genres.findOneAndDelete({ _id: req.params.id });
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.status(200).send(genre);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await genres.findOne({ _id: req.params.id });
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
