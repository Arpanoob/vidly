const express = require("express");
const { movie, validate } = require("../models/movies");
const { genres } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await movie.find();
  res.send(movies);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await genres.findById(req.body.genreId);
  if (!genre) return res.status(500).send("Invalid Genre");
  const result = await movie.create({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  res.send(result);
  res.status(500).send("Error" + e.message);
});
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const genre = await genres.findById(req.body.genreId);
  if (!genre) return res.status(500).send("Invalid Genre");

  const result = await movie.updateOne(
    { _id: req.params.id },
    {
      $set: {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
      },
    },
    { new: true }
  );
  res.send(result);
});
router.delete("/:id", auth, async (req, res) => {
  const deleted = await movie.deleteOne({ _id: req.params.id });
  res.send(deleted);
});
router.delete("/genre:id", [auth, admin], async (req, res) => {
  const deleted = await movie.updateOne(
    { _id: req.params.id },
    {
      $unset: {
        genre: "",
      },
    }
  );
  res.send(deleted);
});

module.exports = router;
